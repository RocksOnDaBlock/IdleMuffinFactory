let muffins = 0;
let coins = 0;
let level = 1;
let experience = 0;
let selectedMuffinType = 'plain';

let upgrades = {
    autobaker: { count: 0, cost: 50, multiplier: 1 },
    flavorBoost: { count: 0, cost: 100, multiplier: 1 },
    doubleClick: { count: 0, cost: 200, multiplier: 1 },
    marketing: { count: 0, cost: 500, multiplier: 0 },
    manager: { count: 0, cost: 1000, multiplier: 0 }
};

let muffinTypes = {
    plain: { value: 1, experienceGain: 1 },
    chocolate: { value: 2, experienceGain: 2, unlockedAtLevel: 3 },
    blueberry: { value: 3, experienceGain: 3, unlockedAtLevel: 5 }
};

function updateDisplay() {
    document.getElementById('muffins').textContent = Math.floor(muffins);
    document.getElementById('coins').textContent = Math.floor(coins);
    document.getElementById('autobakers').textContent = upgrades.autobaker.count;
    document.getElementById('autobakerMultiplier').textContent = upgrades.autobaker.multiplier;
    document.getElementById('flavorBoost').textContent = upgrades.flavorBoost.multiplier;
    document.getElementById('doubleClick').textContent = upgrades.doubleClick.multiplier;
    document.getElementById('marketing').textContent = upgrades.marketing.multiplier;
    document.getElementById('managerPercentage').textContent = upgrades.manager.multiplier;
    document.getElementById('level').textContent = level;

    for (let upgrade in upgrades) {
        document.getElementById(`${upgrade}Button`).disabled = coins < upgrades[upgrade].cost;
        document.getElementById(`${upgrade}Button`).textContent = `Buy ${upgrade} (${upgrades[upgrade].cost} coins)`;
    }

    // Update progress bar
    let nextLevelExperience = level * 100;
    let progress = (experience / nextLevelExperience) * 100;
    document.getElementById('progress').style.width = progress + '%';

    // Update muffin type selections
    for (let type in muffinTypes) {
        let element = document.querySelector(`.muffin-type:nth-child(${Object.keys(muffinTypes).indexOf(type) + 1})`);
        if (muffinTypes[type].unlockedAtLevel && level < muffinTypes[type].unlockedAtLevel) {
            element.style.opacity = '0.5';
            element.style.cursor = 'not-allowed';
        } else {
            element.style.opacity = '1';
            element.style.cursor = 'pointer';
        }
    }
}

function selectMuffinType(type) {
    if (muffinTypes[type].unlockedAtLevel && level < muffinTypes[type].unlockedAtLevel) {
        alert(`You need to reach level ${muffinTypes[type].unlockedAtLevel} to unlock ${type} muffins!`);
        return;
    }
    selectedMuffinType = type;
    document.querySelectorAll('.muffin-type').forEach(el => el.classList.remove('selected'));
    document.querySelector(`.muffin-type:nth-child(${Object.keys(muffinTypes).indexOf(type) + 1})`).classList.add('selected');
}

function bakeMuffin() {
    muffins += upgrades.doubleClick.multiplier * muffinTypes[selectedMuffinType].value;
    gainExperience(muffinTypes[selectedMuffinType].experienceGain);
    updateDisplay();
    createRisingMuffin();
}

function gainExperience(amount) {
    experience += amount;
    let nextLevelExperience = level * 100;
    while (experience >= nextLevelExperience) {
        level++;
        experience -= nextLevelExperience;
        nextLevelExperience = level * 100;
        alert(`Congratulations! You've reached level ${level}!`);
    }
    updateDisplay();
}

function createRisingMuffin() {
    const muffin = document.createElement('div');
    muffin.textContent = selectedMuffinType === 'plain' ? '🧁' : (selectedMuffinType === 'chocolate' ? '🍫' : '🫐');
    muffin.classList.add('rising-muffin');
    muffin.style.left = `${Math.random() * 80 + 10}%`;
    document.body.appendChild(muffin);
    setTimeout(() => muffin.remove(), 1000);
}

function sellMuffins(amount) {
    let totalCoins = amount * upgrades.flavorBoost.multiplier * muffinTypes[selectedMuffinType].value;
    if (Math.random() < upgrades.marketing.multiplier / 100) {
        totalCoins *= 2;
    }
    coins += totalCoins;
    muffins -= amount;
    updateDisplay();
}

function sellAllMuffins() {
    if (muffins > 0) {
        sellMuffins(muffins);
        if (upgrades.marketing.multiplier > 0 && Math.random() < upgrades.marketing.multiplier / 100) {
            alert("Marketing boost! Double coins earned!");
        }
    }
}

function buyUpgrade(upgradeType) {
    let upgrade = upgrades[upgradeType];
    if (coins >= upgrade.cost) {
        coins -= upgrade.cost;
        upgrade.count++;
        upgrade.cost = Math.floor(upgrade.cost * 1.5);

        switch(upgradeType) {
            case 'autobaker':
                if (upgrade.count % 5 === 0) upgrade.multiplier++;
                break;
            case 'flavorBoost':
                upgrade.multiplier++;
                break;
            case 'doubleClick':
                upgrade.multiplier *= 2;
                break;
            case 'marketing':
                upgrade.multiplier += 5;
                break;
            case 'manager':
                upgrade.multiplier += 5;
                break;
        }

        updateDisplay();
    }
}

setInterval(function() {
    muffins += upgrades.autobaker.count * upgrades.autobaker.multiplier * muffinTypes[selectedMuffinType].value;
    gainExperience(upgrades.autobaker.count * upgrades.autobaker.multiplier * muffinTypes[selectedMuffinType].experienceGain);
    updateDisplay();
}, 1000);

setInterval(function() {
    if (upgrades.manager.multiplier > 0) {
        let muffinsToSell = Math.floor(muffins * (upgrades.manager.multiplier / 100));
        if (muffinsToSell > 0) {
            sellMuffins(muffinsToSell);
        }
    }
}, 5000);

updateDisplay();