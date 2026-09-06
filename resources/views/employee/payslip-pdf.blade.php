<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Payslip - {{ $employee->first_name }} {{ $employee->last_name }}</title>
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
            font-size: 20px;
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
            font-size: 24px;
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
    </style>
</head>
<body>
    <div class="watermark">CONFIDENTIAL</div>
    
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>{{ $organization->name }}</h1>
            <h2>Payslip for {{ $payrollRun->period_month }}</h2>
            <p>Pay Period: {{ \Carbon\Carbon::parse($payrollRun->period_start)->format('F j, Y') }} - {{ \Carbon\Carbon::parse($payrollRun->period_end)->format('F j, Y') }}</p>
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
                    <span class="info-label">Department:</span>
                    <span class="info-value">{{ $employee->department ?? 'N/A' }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Job Title:</span>
                    <span class="info-value">{{ $employee->job_title ?? 'N/A' }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Employment Type:</span>
                    <span class="info-value">{{ $employee->employment_type ?? 'N/A' }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Status:</span>
                    <span class="info-value"><span class="badge">{{ ucfirst($employee->status) }}</span></span>
                </div>
            </div>
        </div>

        <!-- Earnings -->
        <div class="section">
            <div class="section-title">Earnings</div>
            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th class="amount">Amount (NGN)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Basic Salary</td>
                        <td class="amount">{{ number_format($calculation['basic_salary'] ?? 0, 2) }}</td>
                    </tr>
                    <tr>
                        <td>Housing Allowance</td>
                        <td class="amount">{{ number_format($calculation['housing_allowance'] ?? 0, 2) }}</td>
                    </tr>
                    <tr>
                        <td>Transport Allowance</td>
                        <td class="amount">{{ number_format($calculation['transport_allowance'] ?? 0, 2) }}</td>
                    </tr>
                    <tr>
                        <td>Other Allowances</td>
                        <td class="amount">{{ number_format($calculation['other_allowance_1'] ?? 0 + ($calculation['other_allowance_2'] ?? 0), 2) }}</td>
                    </tr>
                    <tr class="total-row">
                        <td><strong>Total Earnings</strong></td>
                        <td class="amount"><strong>{{ number_format($calculation['total_earnings'] ?? 0, 2) }}</strong></td>
                    </tr>
                    <tr class="total-row">
                        <td><strong>Gross Salary</strong></td>
                        <td class="amount"><strong>{{ number_format($calculation['gross_salary'] ?? 0, 2) }}</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Deductions -->
        <div class="section">
            <div class="section-title">Statutory Deductions</div>
            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th class="amount">Amount (NGN)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>PAYE (Income Tax)</td>
                        <td class="amount">{{ number_format($calculation['paye_deduction'] ?? 0, 2) }}</td>
                    </tr>
                    <tr>
                        <td>Pension (Employee Contribution - 8%)</td>
                        <td class="amount">{{ number_format($calculation['pension_deduction'] ?? 0, 2) }}</td>
                    </tr>
                    <tr>
                        <td>NHF (National Housing Fund)</td>
                        <td class="amount">{{ number_format($calculation['nhf_deduction'] ?? 0, 2) }}</td>
                    </tr>
                    <tr>
                        <td>NHIS (Employee Contribution - 5%)</td>
                        <td class="amount">{{ number_format($calculation['nhis_deduction'] ?? 0, 2) }}</td>
                    </tr>
                    <tr>
                        <td>NSITF (Social Insurance)</td>
                        <td class="amount">{{ number_format($calculation['nsitf_deduction'] ?? 0, 2) }}</td>
                    </tr>
                    <tr>
                        <td>Other Deductions</td>
                        <td class="amount">{{ number_format($calculation['other_deductions'] ?? 0, 2) }}</td>
                    </tr>
                    <tr class="total-row">
                        <td><strong>Total Deductions</strong></td>
                        <td class="amount"><strong>{{ number_format($calculation['total_deductions'] ?? 0, 2) }}</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Net Pay Summary -->
        <div class="summary-box">
            <div class="label">NET PAY FOR {{ strtoupper($payrollRun->period_month) }}</div>
            <div class="amount">NGN {{ number_format($calculation['net_pay'] ?? 0, 2) }}</div>
            <div style="font-size: 10px; margin-top: 5px;">This amount will be credited to your bank account</div>
        </div>

        <!-- Bank Details -->
        <div class="section">
            <div class="section-title">Payment Details</div>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Bank Name:</span>
                    <span class="info-value">{{ $employee->bank_name }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Account Name:</span>
                    <span class="info-value">{{ $employee->bank_account_name }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Account Number:</span>
                    <span class="info-value">{{ $employee->bank_account_number }}</span>
                </div>
            </div>
        </div>

        <!-- Employer Contributions -->
        <div class="section">
            <div class="section-title">Employer Contributions (For Information Only)</div>
            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th class="amount">Amount (NGN)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Pension (Employer Contribution - 10%)</td>
                        <td class="amount">{{ number_format($calculation['pension_employer'] ?? 0, 2) }}</td>
                    </tr>
                    <tr>
                        <td>NHIS (Employer Contribution - 10%)</td>
                        <td class="amount">{{ number_format($calculation['nhis_employer'] ?? 0, 2) }}</td>
                    </tr>
                    <tr class="total-row">
                        <td><strong>Total Employer Contributions</strong></td>
                        <td class="amount"><strong>{{ number_format(($calculation['pension_employer'] ?? 0) + ($calculation['nhis_employer'] ?? 0), 2) }}</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>Important Notes:</strong></p>
            <p>• This payslip is computer-generated and valid without signature</p>
            <p>• This document contains confidential salary information</p>
            <p>• Please verify all deductions and contact HR if there are discrepancies</p>
            <p>• Employer contributions are shown for information purposes only</p>
            <p style="margin-top: 10px;">Generated by {{ $organization->name }} Payroll System | Document ID: {{ $payrollRun->id }}-{{ $employee->id }}</p>
        </div>
    </div>
</body>
</html>