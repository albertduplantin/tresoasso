import { Project, Transaction } from '@/types';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { BUDGET_CATEGORIES } from '@/constants';

/**
 * Exporte un projet et ses transactions en CSV
 */
export function exportProjectToCSV(
  project: Project,
  transactions: Transaction[]
): void {
  // Header du fichier
  const headers = [
    'Date',
    'Description',
    'Type',
    'Catégorie',
    'Montant',
    'Certitude',
    'Statut',
    'Partenaire',
    'Notes',
  ];

  // Lignes de données
  const rows = transactions.map(t => {
    const category = BUDGET_CATEGORIES.find(c => c.id === t.categoryId);
    return [
      formatDate(t.transactionDate),
      t.description,
      t.type === 'revenue' ? 'Recette' : 'Dépense',
      category?.name || 'Non catégorisé',
      t.amount.toFixed(2),
      t.certainty === 'confirmed' ? 'Certain' : t.certainty === 'probable' ? 'Probable' : 'Hypothétique',
      t.status,
      t.counterparty.name,
      t.notes || '',
    ];
  });

  // Créer le CSV
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  // Télécharger le fichier
  downloadFile(
    csvContent,
    `export_${project.name}_${new Date().toISOString().split('T')[0]}.csv`,
    'text/csv;charset=utf-8;'
  );
}

/**
 * Exporte un rapport détaillé du projet en HTML (pour impression/PDF)
 */
export function exportProjectReport(
  project: Project,
  transactions: Transaction[]
): void {
  // Calculer les statistiques
  const revenues = transactions.filter(t => t.type === 'revenue');
  const expenses = transactions.filter(t => t.type === 'expense');
  
  const totalRevenues = revenues.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const balance = totalRevenues - totalExpenses;

  const confirmedRevenues = revenues.filter(t => t.certainty === 'confirmed').reduce((sum, t) => sum + t.amount, 0);
  const confirmedExpenses = expenses.filter(t => t.certainty === 'confirmed').reduce((sum, t) => sum + t.amount, 0);

  const totalBudget = project.budgetCategories?.reduce((sum, cat) => sum + (cat.budgetedAmount || 0), 0) || 0;

  // Stats par catégorie
  const categoryStats = new Map();
  transactions.forEach(transaction => {
    const category = BUDGET_CATEGORIES.find(c => c.id === transaction.categoryId);
    if (!category) return;

    if (!categoryStats.has(category.id)) {
      categoryStats.set(category.id, {
        category,
        total: 0,
        count: 0,
        budgeted: project.budgetCategories?.find(c => c.id === category.id)?.budgetedAmount || 0,
      });
    }

    const stat = categoryStats.get(category.id);
    stat.total += transaction.amount;
    stat.count += 1;
  });

  const categoryStatsArray = Array.from(categoryStats.values()).sort((a, b) => b.total - a.total);

  // Générer le HTML
  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rapport - ${project.name}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    .header {
      border-bottom: 3px solid #6366f1;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    h1 {
      color: #6366f1;
      margin: 0 0 10px 0;
    }
    .subtitle {
      color: #6b7280;
      margin: 5px 0;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #6366f1;
    }
    .stat-label {
      color: #6b7280;
      font-size: 14px;
      margin-bottom: 5px;
    }
    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #111827;
    }
    .stat-value.positive {
      color: #10b981;
    }
    .stat-value.negative {
      color: #ef4444;
    }
    .section {
      margin-bottom: 40px;
    }
    .section-title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 15px;
      color: #111827;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }
    th {
      background: #f9fafb;
      font-weight: 600;
      color: #6b7280;
      font-size: 14px;
    }
    tr:hover {
      background: #f9fafb;
    }
    .revenue {
      color: #10b981;
      font-weight: 600;
    }
    .expense {
      color: #ef4444;
      font-weight: 600;
    }
    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }
    .badge.confirmed {
      background: #d1fae5;
      color: #065f46;
    }
    .badge.probable {
      background: #fef3c7;
      color: #92400e;
    }
    .badge.potential {
      background: #e5e7eb;
      color: #374151;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      color: #6b7280;
      font-size: 14px;
      text-align: center;
    }
    @media print {
      body {
        padding: 0;
      }
      .stat-card {
        break-inside: avoid;
      }
      table {
        page-break-inside: auto;
      }
      tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${project.name}</h1>
    <p class="subtitle">Année fiscale ${project.fiscalYear}</p>
    <p class="subtitle">Rapport généré le ${formatDate(new Date())}</p>
    ${project.description ? `<p class="subtitle">${project.description}</p>` : ''}
  </div>

  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-label">Budget Total</div>
      <div class="stat-value">${formatCurrency(totalBudget)}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Dépenses</div>
      <div class="stat-value negative">${formatCurrency(totalExpenses)}</div>
      <div class="stat-label" style="margin-top: 5px;">${formatCurrency(confirmedExpenses)} certaines</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Recettes</div>
      <div class="stat-value positive">${formatCurrency(totalRevenues)}</div>
      <div class="stat-label" style="margin-top: 5px;">${formatCurrency(confirmedRevenues)} certaines</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Solde</div>
      <div class="stat-value ${balance >= 0 ? 'positive' : 'negative'}">${formatCurrency(balance)}</div>
      <div class="stat-label" style="margin-top: 5px;">${balance >= 0 ? 'Excédent' : 'Déficit'}</div>
    </div>
  </div>

  ${categoryStatsArray.length > 0 ? `
  <div class="section">
    <h2 class="section-title">Répartition par Catégorie</h2>
    <table>
      <thead>
        <tr>
          <th>Catégorie</th>
          <th>Transactions</th>
          <th>Budget</th>
          <th>Dépensé</th>
          <th>% Utilisé</th>
        </tr>
      </thead>
      <tbody>
        ${categoryStatsArray.map(stat => {
          const usedPercent = stat.budgeted > 0 ? (stat.total / stat.budgeted) * 100 : 0;
          return `
          <tr>
            <td><strong>${stat.category.name}</strong></td>
            <td>${stat.count}</td>
            <td>${formatCurrency(stat.budgeted)}</td>
            <td class="expense">${formatCurrency(stat.total)}</td>
            <td>${usedPercent.toFixed(1)}%</td>
          </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  </div>
  ` : ''}

  <div class="section">
    <h2 class="section-title">Transactions (${transactions.length})</h2>
    ${transactions.length > 0 ? `
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Catégorie</th>
          <th>Partenaire</th>
          <th>Certitude</th>
          <th style="text-align: right;">Montant</th>
        </tr>
      </thead>
      <tbody>
        ${transactions.map(t => {
          const category = BUDGET_CATEGORIES.find(c => c.id === t.categoryId);
          return `
          <tr>
            <td>${formatDate(t.transactionDate)}</td>
            <td><strong>${t.description}</strong></td>
            <td>${category?.name || 'Non catégorisé'}</td>
            <td>${t.counterparty.name}</td>
            <td>
              <span class="badge ${t.certainty}">
                ${t.certainty === 'confirmed' ? 'Certain' : t.certainty === 'probable' ? 'Probable' : 'Hypothétique'}
              </span>
            </td>
            <td style="text-align: right;" class="${t.type}">
              ${t.type === 'revenue' ? '+' : '-'}${formatCurrency(t.amount)}
            </td>
          </tr>
          `;
        }).join('')}
      </tbody>
    </table>
    ` : '<p style="color: #6b7280; text-align: center;">Aucune transaction</p>'}
  </div>

  <div class="footer">
    <p>TrésoAsso - Gestion de trésorerie pour associations</p>
    <p>Ce rapport est confidentiel et destiné uniquement à un usage interne</p>
  </div>
</body>
</html>
  `;

  // Ouvrir dans une nouvelle fenêtre pour impression
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
}

/**
 * Fonction utilitaire pour télécharger un fichier
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

