// mira_leaderboard.js
const MIRA_JSON_PATH = './mira_leaderboard.json';

// 定义类别映射，用于 CSS 样式
const CATEGORY_MAP = {
    "human_expert": "human_expert",
    "proprietary": "proprietary",
    "open_source_U": "open_source",
    "open_source_UG": "open_source"
};

// 渲染表格的函数
function renderMiraLeaderboard() {
    fetch(MIRA_JSON_PATH)
        .then(response => {
            if (!response.ok) {
                console.error(`Error loading JSON: ${response.statusText}`);
                throw new Error('Failed to load MIRA leaderboard data.');
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.getElementById('mira-table').querySelector('tbody');
            if (!tbody) return;
            tbody.innerHTML = ''; 

            // 按照 Visual-CoT (V) 整体准确率降序排序
            const sortedData = data.leaderboardData.sort((a, b) => 
                parseFloat(b.mira.overall_v) - parseFloat(a.mira.overall_v)
            );

            sortedData.forEach(item => {
                const categoryClass = CATEGORY_MAP[item.info.type] || '';
                const row = document.createElement('tr');
                row.className = categoryClass;

                // 准备数据
                const overallD = item.mira.overall_d || '-';
                const overallT = item.mira.overall_t || '-';
                const overallV = item.mira.overall_v || '-';
                
                // 替换 CoT 字段的显示值
                const inputType = item.info.CoT === 'D/T' ? 'D/T/V' : item.info.CoT;

                // 构建行内容 (只包含 Name, Size, Input, D, T, V)
                row.innerHTML = `
                    <td>${item.info.name}</td>
                    <td>${item.info.size}</td>
                    <td>${inputType}</td>
                    <td data-sort-value="${overallD}">${overallD}%</td>
                    <td data-sort-value="${overallT}">${overallT}%</td>
                    <td data-sort-value="${overallV}">${overallV}%</td>
                `;
                tbody.appendChild(row);
            });
            
            // 移除非 D/T/V 列的交互逻辑，因为它们不再存在
        })
        .catch(error => {
            console.error('Failed to render MIRA leaderboard:', error);
            const tbody = document.getElementById('mira-table').querySelector('tbody');
            if (tbody) tbody.innerHTML = `<tr><td colspan="6" class="has-text-danger">Failed to load leaderboard data. Please check mira_leaderboard.json.</td></tr>`;
        });
}

// 确保 DOM 加载完成后运行
document.addEventListener('DOMContentLoaded', renderMiraLeaderboard);
