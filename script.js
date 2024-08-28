let muffins = 0;
        let coins = 0;
        let level = 1;
        let experience = 0;
        let selectedMuffinType = 'plain';

        let upgrades = {
            autobaker: { count: 0, cost: 100, multiplier: 1 },
            flavorBoost: { count: 0, cost: 200, multiplier: 1 },
            doubleClick: { count: 0, cost: 400, multiplier: 1 },
            marketing: { count: 0, cost: 1000, multiplier: 0 },
            manager: { count: 0, cost: 2000, multiplier: 0 }
        };

        let muffinTypes = {
            plain: { value: 1, experienceGain: 1 },
            chocolate: { value: 2, experienceGain: 2, unlockedAtLevel: 10 },
            blueberry: { value: 3, experienceGain: 3, unlockedAtLevel: 20 }
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
                let button = document.getElementById(`${upgrade}Button`);
                button.disabled = coins < upgrades[upgrade].cost;
                button.textContent = `Buy ${upgrade} (${upgrades[upgrade].cost} coins)`;
                
                if ((upgrade === 'marketing' || upgrade === 'manager') && upgrades[upgrade].multiplier >= 100) {
                    button.disabled = true;
                    button.textContent = `${upgrade} (Maxed)`;
                }
            }

            let nextLevelExperience = level * 100;
            let progress = (experience / nextLevelExperience) * 100;
            document.getElementById('progress').style.width = progress + '%';

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

            document.querySelectorAll('.muffin-type').forEach(el => el.classList.remove('selected'));
            document.querySelector(`.muffin-type:nth-child(${Object.keys(muffinTypes).indexOf(selectedMuffinType) + 1})`).classList.add('selected');
        }

        function selectMuffinType(type) {
            if (muffinTypes[type].unlockedAtLevel && level < muffinTypes[type].unlockedAtLevel) {
                alert(`You need to reach level ${muffinTypes[type].unlockedAtLevel} to unlock ${type} muffins!`);
                return;
            }
            selectedMuffinType = type;
            updateDisplay();
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
            amount = Math.min(amount, muffins);
            let totalCoins = amount * upgrades.flavorBoost.multiplier * muffinTypes[selectedMuffinType].value;
            if (Math.random() < upgrades.marketing.multiplier / 100) {
                totalCoins *= 1.5;  // Reduced marketing bonus
            }
            coins += totalCoins;
            muffins -= amount;
            updateDisplay();
        }

        function sellAllMuffins() {
            if (muffins > 0) {
                sellMuffins(muffins);
                if (upgrades.marketing.multiplier > 0 && Math.random() < upgrades.marketing.multiplier / 100) {
                    alert("Marketing boost! 50% more coins earned!");
                }
            }
        }

        function buyUpgrade(upgradeType) {
            let upgrade = upgrades[upgradeType];
            if (coins >= upgrade.cost) {
                coins -= upgrade.cost;
                upgrade.count++;
                upgrade.cost = Math.floor(upgrade.cost * 1.8);  // Increased cost scaling

                switch(upgradeType) {
                    case 'autobaker':
                        if (upgrade.count % 10 === 0) upgrade.multiplier++;  // Reduced autobaker effectiveness
                        break;
                    case 'flavorBoost':
                        upgrade.multiplier += 0.5;  // Reduced flavor boost
                        break;
                    case 'doubleClick':
                        upgrade.multiplier *= 1.5;  // Reduced double click effect
                        break;
                    case 'marketing':
                        upgrade.multiplier = Math.min(upgrade.multiplier + 2, 100);  // Reduced marketing increase
                        break;
                    case 'manager':
                        upgrade.multiplier = Math.min(upgrade.multiplier + 2, 100);  // Reduced manager increase
                        break;
                }

                updateDisplay();
            }
        }

        function saveGame() {
            let gameState = {
                muffins,
                coins,
                level,
                experience,
                selectedMuffinType,
                upgrades
            };
            localStorage.setItem('muffinClickerSave', JSON.stringify(gameState));
        }

        function loadGame() {
            let savedState = localStorage.getItem('muffinClickerSave');
            if (savedState) {
                let gameState = JSON.parse(savedState);
                muffins = gameState.muffins;
                coins = gameState.coins;
                level = gameState.level;
                experience = gameState.experience;
                selectedMuffinType = gameState.selectedMuffinType;
                upgrades = gameState.upgrades;
                updateDisplay();
            }
        }

        function resetGame() {
            if (confirm("Are you sure you want to reset your game? All progress will be lost.")) {
                localStorage.removeItem('muffinClickerSave');
                location.reload();
            }
        }

        setInterval(function() {
            muffins += upgrades.autobaker.count * upgrades.autobaker.multiplier * muffinTypes[selectedMuffinType].value * 0.5;  // Reduced autobaker production
            gainExperience(upgrades.autobaker.count * upgrades.autobaker.multiplier * muffinTypes[selectedMuffinType].experienceGain * 0.5);  // Reduced autobaker experience
            updateDisplay();
        }, 1000);

        setInterval(function() {
            if (upgrades.manager.multiplier > 0) {
                let muffinsToSell = Math.floor(muffins * (upgrades.manager.multiplier / 200));  // Reduced manager effectiveness
                if (muffinsToSell > 0) {
                    sellMuffins(muffinsToSell);
                }
            }
        }, 5000);

        setInterval(saveGame, 5000);  // Save game every 5 seconds

        window.onload = loadGame;  // Load game when page loads

        updateDisplay();