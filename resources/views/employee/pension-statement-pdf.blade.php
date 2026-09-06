<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Pension Statement - {{ $employee->first_name }} {{ $employee->last_name }}</title>
    <style>
        body {
            font-family: DejaVu Sans, Arial, sans-serif;
            font-size: 11px;
            margin: 0;
            padding: 20px;
            color: #333;
            line-height: 1.4;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 3px solid #2c3e50;
            padding-bottom: 15px;
        }
        .header h1 {
            font-size: 18px;
            margin: 0 0 5px 0;
            color: #2c3e50;
            font-weight: bold;
        }
        .header h2 {
            font-size: 14px;
            margin: 0 0 10px 0;
            color: #7f8c8d;
            font-weight: normal;
        }
        .header p {
            margin: 3px 0;
            color: #95a5a6;
            font-size: 10px;
        }
        .section {
            margin-bottom: 20px;
        }
        .section-title {
            font-size: 12px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
            border-bottom: 1px solid #ecf0f1;
            padding-bottom: 5px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 15px;
        }
        .info-item {
            display: flex;
            justify-content: space-between;
        }
        .info-label {
            color: #7f8c8d;
            font-weight: 500;
        }
        .info-value {
            color: #2c3e50;
            font-weight: 600;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th {
            background-color: #f8f9fa;
            font-weight: bold;
            text-align: left;
            padding: 8px 10px;
            border: 1px solid #dee2e6;
            font-size: 10px;
            color: #495057;
        }
        td {
            padding: 8px 10px;
            border: 1px solid #dee2e6;
            font-size: 10px;
        }
        tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        .amount {
            text-align: right;
            font-family: 'Courier New', monospace;
            font-weight: 600;
        }
        .total-row {
            background-color: #e8f4f8 !important;
            font-weight: bold;
        }
        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #ecf0f1;
            text-align: center;
            font-size: 9px;
            color: #95a5a6;
        }
        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 80px;
            color: rgba(0, 0, 0, 0.03);
            font-weight: bold;
            z-index: -1;
            pointer-events: none;
        }
        .badge {
            display: inline-block;
            padding: 2px 8px;
            background-color: #27ae60;
            color: white;
            border-radius: 3px;
            font-size: 9px;
            font-weight: bold;
        }
        .summary-box {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .summary-box .label {
            font-size: 12px;
            margin-bottom: 5px;
        }
        .summary-box .amount {
            font-size: 20px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="watermark">OFFICIAL DOCUMENT</div>
    
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>{{ $organization->name }}</h1>
            <h2>Pension Contribution Statement</h2>
            <p>Statement Year: {{ $year }}</p>
            <p>Generated: {{ $generatedAt }}</p>
        </div>

        <!-- Employee Information -->
        <div class="section">
            <div class="section-title">Employee Information</div>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Employee Name:</span>
                    <span class="info-value">{{ $employee->first_name }} {{ $employee->last_name }} {{ $employee->middle_name ?? '' }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Employee Number:</span>
                    <span class="info-value">{{ $employee->employee_number }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Pension PIN (RSA PIN):</span>
                    <span class="info-value">{{ $employee->pension_pin ?? 'N/A' }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">PFA Name:</span>
                    <span class="info-value">{{ $employee->pfa_name ?? 'N/A' }}</span>
                </div>
            </div>
        </div>

        <!-- Monthly Contributions -->
        <div class="section">
            <div class="section-title">Monthly Contributions ({{ $year }})</div>
            <table>
                <thead>
                    <tr>
                        <th>Period</th>
                        <th class="amount">Employee (8%)</th>
                        <th class="amount">Employer (10%)</th>
                        <th class="amount">Total</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($contributions as $contribution)
                    <tr>
                        <td>{{ $contribution['period'] }}</td>
                        <td class="amount">{{ number_format($contribution['employeeContribution'], 2) }}</td>
                        <td class="amount">{{ number_format($contribution['employerContribution'], 2) }}</td>
                        <td class="amount">{{ number_format($contribution['total'], 2) }}</td>
                    </tr>
                    @endforeach
                    <tr class="total-row">
                        <td><strong>Total for {{ $year }}</strong></td>
                        <td class="amount"><strong>{{ number_format($totals['employee'], 2) }}</strong></td>
                        <td class="amount"><strong>{{ number_format($totals['employer'], 2) }}</strong></td>
                        <td class="amount"><strong>{{ number_format($totals['total'], 2) }}</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Year Summary -->
        <div class="summary-box">
            <div class="label">TOTAL PENSION CONTRIBUTIONS ({{ $year }})</div>
            <div class="amount">NGN {{ number_format($totals['total'], 2) }}</div>
            <div style="font-size: 10px; margin-top: 5px;">
                Employee: NGN {{ number_format($totals['employee'], 2) }} | Employer: NGN {{ number_format($totals['employer'], 2) }}
            </div>
        </div>

        <!-- Regulatory Information -->
        <div class="section">
            <div class="section-title">Regulatory Information</div>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Pension Reform Act:</span>
                    <span class="info-value">2014 (as amended)</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Employee Rate:</span>
                    <span class="info-value">8% of Basic + Transport + Housing</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Employer Rate:</span>
                    <span class="info-value">10% of Basic + Transport + Housing</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Remittance Status:</span>
                    <span class="info-value"><span class="badge">REMITTED</span></span>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>Important Notes:</strong></p>
            <p>• This statement is computer-generated and valid without signature</p>
            <p>• This document contains confidential pension information</p>
            <p>• Contributions are remitted to your PFA as per PENCOM regulations</p>
            <p>• Please verify your RSA PIN with your PFA for account verification</p>
            <p>• For any queries, contact the HR or Finance department</p>
            <p style="margin-top: 10px;">Generated by {{ $organization->name }} Payroll System | Statement ID: {{ $year }}-{{ $employee->id }}</p>
        </div>
    </div>
</body>
</html>