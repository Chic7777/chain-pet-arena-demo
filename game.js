// 游戏状态管理
const gameState = {
    wallet: {
        address: null,
        chainId: 31337,
        network: 'Mock Sepolia',
        connected: false
    },
    pet: null,
    balance: 0,
    logs: []
};

// 宠物名字池
const petNames = [
    'Pikachu', 'Charmander', 'Squirtle', 'Bulbasaur',
    'Eevee', 'Meowth', 'Jigglypuff', 'Snorlax',
    'Psyduck', 'Gengar', 'Dragonite', 'Mew'
];

const petVisuals = {
    Pikachu: '🐹',
    Charmander: '🦎',
    Squirtle: '🐢',
    Bulbasaur: '🌱',
    Eevee: '🦊',
    Meowth: '🐱',
    Jigglypuff: '🎀',
    Snorlax: '🐻',
    Psyduck: '🦆',
    Gengar: '👻',
    Dragonite: '🐲',
    Mew: '✨'
};

// 稀有度配置
const rarityConfig = {
    'Common': { weight: 50, color: '#95a5a6' },
    'Rare': { weight: 30, color: '#3498db' },
    'Epic': { weight: 15, color: '#9b59b6' },
    'Legendary': { weight: 5, color: '#f39c12' }
};

// 工具函数：生成随机钱包地址
function generateWalletAddress() {
    const chars = '0123456789abcdef';
    let address = '0x';
    for (let i = 0; i < 40; i++) {
        address += chars[Math.floor(Math.random() * chars.length)];
    }
    return address;
}

// 工具函数：随机整数
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 工具函数：根据权重随机选择稀有度
function getRandomRarity() {
    const totalWeight = Object.values(rarityConfig).reduce((sum, r) => sum + r.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const [rarity, config] of Object.entries(rarityConfig)) {
        random -= config.weight;
        if (random <= 0) {
            return rarity;
        }
    }
    return 'Common';
}

// 工具函数：格式化时间戳
function formatTimestamp() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

// 添加日志
function addLog(type, content) {
    const logTypes = {
        'info': 'INFO',
        'success': 'SUCCESS',
        'warning': 'WARNING',
        'error': 'ERROR'
    };
    
    const log = {
        time: formatTimestamp(),
        type: logTypes[type] || 'INFO',
        content: content,
        className: `log-${type}`
    };
    
    gameState.logs.push(log);
    updateLogsUI();
}

// 连接模拟钱包
function connectWallet(walletName = 'Mock Wallet') {
    if (gameState.wallet.connected) {
        addLog('warning', '钱包已连接');
        return;
    }
    
    // 生成模拟钱包信息
    gameState.wallet.address = generateWalletAddress();
    gameState.wallet.connected = true;
    gameState.balance = 100; // 初始 100 PET 代币
    
    addLog('success', `${walletName} 已连接: ${gameState.wallet.address}`);
    addLog('info', `网络: ${gameState.wallet.network} (Chain ID: ${gameState.wallet.chainId})`);
    addLog('info', `初始余额: ${gameState.balance} PET`);
    
    updateUI();
}

// 打开模拟钱包弹窗
function openWalletModal() {
    if (gameState.wallet.connected) {
        addLog('warning', '钱包已连接');
        return;
    }

    const walletModal = document.getElementById('walletModal');
    walletModal.classList.add('is-open');
    walletModal.setAttribute('aria-hidden', 'false');

    const firstOption = walletModal.querySelector('.wallet-option');
    if (firstOption) {
        firstOption.focus();
    }
}

// 关闭模拟钱包弹窗
function closeWalletModal() {
    const walletModal = document.getElementById('walletModal');
    walletModal.classList.remove('is-open');
    walletModal.setAttribute('aria-hidden', 'true');
}

// 从弹窗选择一个模拟钱包
function selectMockWallet(event) {
    const walletName = event.currentTarget.dataset.walletName || 'Mock Wallet';
    closeWalletModal();
    connectWallet(walletName);
}
// 铸造宠物 NFT
function mintPet() {
    if (!gameState.wallet.connected) {
        addLog('error', '请先连接钱包');
        return;
    }
    
    if (gameState.pet) {
        addLog('warning', '已拥有宠物，无需再次铸造');
        return;
    }
    
    // 生成随机宠物
    const rarity = getRandomRarity();
    const rarityMultiplier = {
        'Common': 1,
        'Rare': 1.5,
        'Epic': 2,
        'Legendary': 3
    };
    
    const baseAttack = randomInt(10, 20);
    const baseDefense = randomInt(8, 18);
    const multiplier = rarityMultiplier[rarity];
    
    gameState.pet = {
        tokenId: randomInt(1000, 9999),
        name: petNames[randomInt(0, petNames.length - 1)],
        rarity: rarity,
        level: 1,
        exp: 0,
        expToNext: 100,
        attack: Math.floor(baseAttack * multiplier),
        defense: Math.floor(baseDefense * multiplier)
    };
    
    addLog('success', `铸造成功！获得 ${rarity} 宠物 ${gameState.pet.name} (Token ID: ${gameState.pet.tokenId})`);
    addLog('info', `属性 - 攻击: ${gameState.pet.attack}, 防御: ${gameState.pet.defense}`);
    
    updateUI();
}

// 训练宠物
function train() {
    if (!gameState.pet) {
        addLog('error', '请先铸造宠物');
        return;
    }
    
    const expGain = randomInt(10, 30);
    gameState.pet.exp += expGain;
    
    addLog('info', `训练中... 获得 ${expGain} 经验值`);
    
    // 检查升级
    if (gameState.pet.exp >= gameState.pet.expToNext) {
        gameState.pet.level++;
        gameState.pet.exp = gameState.pet.exp - gameState.pet.expToNext;
        gameState.pet.expToNext = gameState.pet.level * 100;
        
        // 升级提升属性
        const attackGain = randomInt(2, 5);
        const defenseGain = randomInt(2, 5);
        gameState.pet.attack += attackGain;
        gameState.pet.defense += defenseGain;
        
        addLog('success', `🎉 ${gameState.pet.name} 升级到 Lv.${gameState.pet.level}！`);
        addLog('info', `攻击 +${attackGain}, 防御 +${defenseGain}`);
    }
    
    updateUI();
}

// 战斗
function battle() {
    if (!gameState.pet) {
        addLog('error', '请先铸造宠物');
        return;
    }
    
    // 生成随机敌人
    const enemy = {
        name: petNames[randomInt(0, petNames.length - 1)],
        level: Math.max(1, gameState.pet.level + randomInt(-1, 2)),
        attack: randomInt(10, 20) + gameState.pet.level * 3,
        defense: randomInt(8, 18) + gameState.pet.level * 2
    };
    
    addLog('info', `遭遇野生 ${enemy.name} (Lv.${enemy.level})！`);
    addLog('info', `敌方属性 - 攻击: ${enemy.attack}, 防御: ${enemy.defense}`);
    
    // 计算胜率
    let winChance = 50;
    winChance += (gameState.pet.attack - enemy.defense) * 2;
    winChance += (gameState.pet.defense - enemy.attack) * 1;
    winChance = Math.max(20, Math.min(95, winChance)); // 限制在 20%-95%
    
    const victory = Math.random() * 100 < winChance;
    
    if (victory) {
        const reward = randomInt(10, 50);
        gameState.balance += reward;
        
        addLog('success', `⚔️ 战斗胜利！获得 ${reward} PET 代币`);
        addLog('info', `当前余额: ${gameState.balance} PET`);
        
        // 战斗也获得少量经验
        const expGain = randomInt(15, 25);
        gameState.pet.exp += expGain;
        
        if (gameState.pet.exp >= gameState.pet.expToNext) {
            gameState.pet.level++;
            gameState.pet.exp = gameState.pet.exp - gameState.pet.expToNext;
            gameState.pet.expToNext = gameState.pet.level * 100;
            
            const attackGain = randomInt(2, 5);
            const defenseGain = randomInt(2, 5);
            gameState.pet.attack += attackGain;
            gameState.pet.defense += defenseGain;
            
            addLog('success', `🎉 ${gameState.pet.name} 升级到 Lv.${gameState.pet.level}！`);
        }
    } else {
        addLog('error', `💔 战斗失败！${gameState.pet.name} 需要更多训练`);
        addLog('warning', '提示: 通过训练提升宠物属性可以提高胜率');
    }
    
    updateUI();
}

// 更新 UI
function updateUI() {
    // 更新钱包状态
    const walletStatus = document.getElementById('walletStatus');
    const walletDetail = document.getElementById('walletDetail');
    const walletAddress = document.getElementById('walletAddress');
    const walletNetwork = document.getElementById('walletNetwork');
    const walletBalance = document.getElementById('walletBalance');
    const connectBtn = document.getElementById('connectBtn');
    
    if (gameState.wallet.connected) {
        walletStatus.textContent = '已连接';
        walletStatus.className = 'status-value connected';
        walletDetail.style.display = 'block';
        walletAddress.textContent = gameState.wallet.address;
        walletNetwork.textContent = `${gameState.wallet.network} (${gameState.wallet.chainId})`;
        walletBalance.textContent = gameState.balance;
        connectBtn.disabled = false;
        connectBtn.classList.add('connected-wallet');
        connectBtn.textContent = `${gameState.wallet.address.slice(0, 6)}...${gameState.wallet.address.slice(-4)}`;
        connectBtn.setAttribute('aria-label', `已连接钱包 ${gameState.wallet.address}`);
    } else {
        walletStatus.textContent = '未连接';
        walletStatus.className = 'status-value disconnected';
        walletDetail.style.display = 'none';
        connectBtn.disabled = false;
        connectBtn.classList.remove('connected-wallet');
        connectBtn.textContent = '连接模拟钱包';
        connectBtn.setAttribute('aria-label', '连接模拟钱包');
    }
    
    // 更新宠物信息
    const petCard = document.getElementById('petCard');
    const noPetMsg = document.getElementById('noPetMsg');
    
    if (gameState.pet) {
        petCard.classList.remove('hidden');
        petCard.dataset.rarity = gameState.pet.rarity;
        noPetMsg.style.display = 'none';
        
        document.getElementById('petName').textContent = gameState.pet.name;
        document.getElementById('petRarity').textContent = gameState.pet.rarity;
        document.getElementById('petEmoji').textContent = petVisuals[gameState.pet.name] || '🐾';
        document.getElementById('petTokenId').textContent = `#${gameState.pet.tokenId}`;
        document.getElementById('petLevel').textContent = `Lv.${gameState.pet.level}`;
        document.getElementById('petExp').textContent = `${gameState.pet.exp} / ${gameState.pet.expToNext}`;
        document.getElementById('petAttack').textContent = gameState.pet.attack;
        document.getElementById('petDefense').textContent = gameState.pet.defense;
        
        // 更新经验条
        const expProgress = document.getElementById('expProgress');
        const expPercent = (gameState.pet.exp / gameState.pet.expToNext) * 100;
        expProgress.style.width = `${expPercent}%`;
    } else {
        petCard.classList.add('hidden');
        petCard.removeAttribute('data-rarity');
        noPetMsg.style.display = 'block';
    }
    
    // 更新按钮状态
    const mintBtn = document.getElementById('mintBtn');
    const trainBtn = document.getElementById('trainBtn');
    const battleBtn = document.getElementById('battleBtn');
    
    mintBtn.disabled = !gameState.wallet.connected || gameState.pet !== null;
    trainBtn.disabled = !gameState.pet;
    battleBtn.disabled = !gameState.pet;
}

// 更新日志 UI
function updateLogsUI() {
    const logsList = document.getElementById('logsList');
    
    // 只显示最新的 20 条日志
    const recentLogs = gameState.logs.slice(-20);
    
    logsList.innerHTML = recentLogs.map(log => `
        <div class="log-item ${log.className}">
            <span class="log-time">[${log.time}]</span>
            <span class="log-type">[${log.type}]</span>
            <span class="log-content">${log.content}</span>
        </div>
    `).join('');
    
    // 滚动到底部
    logsList.scrollTop = logsList.scrollHeight;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 绑定按钮事件
    document.getElementById('connectBtn').addEventListener('click', openWalletModal);
    document.getElementById('walletModalClose').addEventListener('click', closeWalletModal);
    document.querySelector('[data-wallet-close]').addEventListener('click', closeWalletModal);
    document.querySelectorAll('.wallet-option').forEach((option) => {
        option.addEventListener('click', selectMockWallet);
    });
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeWalletModal();
        }
    });
    document.getElementById('mintBtn').addEventListener('click', mintPet);
    document.getElementById('trainBtn').addEventListener('click', train);
    document.getElementById('battleBtn').addEventListener('click', battle);
    
    // 初始化 UI
    updateUI();
    
    addLog('info', '游戏已加载，请连接模拟钱包开始游戏');
});



