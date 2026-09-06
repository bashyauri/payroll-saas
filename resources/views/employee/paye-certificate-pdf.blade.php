<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>PAYE Certificate - {{ $employee->first_name }} {{ $employee->last_name }}</title>
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
        .official-stamp {
            border: 2px solid #2c3e50;
            padding: 15px;
            margin-top: 20px;
            text-align: center;
        }
        .official-stamp h3 {
            margin: 0 0 10px 0;
            color: #2c3e50;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="watermark">OFFICIAL DOCUMENT</div>
    
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>{{ $organization->name }}</h1>
            <h2>PAYE Tax Certificate</h2>
            <p>Tax Period: {{ $payrollRun->period_month }}</p>
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
                    <span class="info-label">Tax Identification Number (TIN):</span>
                    <span class="info-value">{{ $employee->tax_identification_number ?? 'N/A' }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Department:</span>
                    <span class="info-value">{{ $employee->department ?? 'N/A' }}</span>
                </div>
            </div>
        </div>

        <!-- PAYE Details -->
        <div class="section">
            <div class="section-title">PAYE Deduction Details</div>
            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th class="amount">Amount (NGN)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Gross Salary</td>
                        <td class="amount">{{ number_format($calculation['gross_salary'] ?? 0, 2) }}</td>
                    </tr>
                    <tr>
                        <td>Consolidated Relief Allowance</td>
                        <td class="amount">{{ number_format(($calculation['gross_salary'] ?? 0) * 0.2, 2) }}</td>
                    </tr>
                    <tr>
                        <td>Taxable Income</td>
                        <td class="amount">{{ number_format(($calculation['gross_salary'] ?? 0) * 0.8, 2) }}</td>
                    </tr>
                    <tr class="total-row">
                        <td><strong>PAYE Tax Deducted</strong></td>
                        <td class="amount"><strong>{{ number_format($calculation['paye_deduction'] ?? 0, 2) }}</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Tax Summary -->
        <div class="section">
            <div class="section-title">Tax Summary</div>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Pay Period:</span>
                    <span class="info-value">{{ \Carbon\Carbon::parse($payrollRun->period_start)->format('F j, Y') }} - {{ \Carbon\Carbon::parse($payrollRun->period_end)->format('F j, Y') }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Payment Status:</span>
                    <span class="info-value"><span class="badge">DEDUCTED</span></span>
                </div>
                <div class="info-item">
                    <span class="info-label">Remittance Date:</span>
                    <span class="info-value">{{ \Carbon\Carbon::parse($payrollRun->finalized_at)->format('F j, Y') }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Certificate Number:</span>
                    <span class="info-value">PAYE-{{ $payrollRun->id }}-{{ $employee->id }}</span>
                </div>
            </div>
        </div>

        <!-- Official Declaration -->
        <div class="official-stamp">
            <h3>OFFICIAL CERTIFICATION</h3>
            <p>This certifies that the PAYE tax shown above has been deducted from the employee's salary and will be remitted to the relevant tax authority in accordance with Nigerian tax laws.</p>
            <p style="margin-top: 10px;"><strong>{{ $organization->name }}</strong></p>
            <p>Employer of Record</p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>Important Notes:</strong></p>
            <p>• This certificate is computer-generated and valid without signature</p>
            <p>• This document contains confidential tax information</p>
            <p>• Please retain for your tax records and filing purposes</p>
            <p>• For any queries, contact the HR or Finance department</p>
            <p style="margin-top: 10px;">Generated by {{ $organization->name }} Payroll System | Certificate ID: {{ $payrollRun->id }}-{{ $employee->id }}</p>
        </div>
    </div>
</body>
</html>