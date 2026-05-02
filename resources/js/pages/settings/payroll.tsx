import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';
import PayrollSettingsController from '@/actions/App/Http/Controllers/Settings/PayrollSettingsController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/payroll/settings';
import type { BreadcrumbItem } from '@/types';

type CustomItem = {
    label: string;
    rate: number;
};

type PayrollSettingsPageProps = {
    settings: {
        basic_salary_percentage: number;
        housing_allowance_percentage: number;
        transport_allowance_percentage: number;
        other_allowance_percentage: number;
        pension_employee_rate: number;
        pension_employer_rate: number;
        nhf_rate: number;
        nhis_employee_rate: number;
        nhis_employer_rate: number;
        nsitf_rate: number;
        other_items: CustomItem[];
    };
    status?: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payroll settings',
        href: edit(),
    },
];

const MAX_CUSTOM_FIELDS = 5;

export default function PayrollSettings({
    settings,
}: PayrollSettingsPageProps) {
    const [customItems, setCustomItems] = useState<CustomItem[]>(
        settings.other_items.length > 0
            ? settings.other_items
            : [{ label: '', rate: 0 }],
    );

    const addCustomItem = (): void => {
        setCustomItems((current) => {
            if (current.length >= MAX_CUSTOM_FIELDS) {
                return current;
            }

            return [...current, { label: '', rate: 0 }];
        });
    };

    const removeCustomItem = (index: number): void => {
        setCustomItems((current) => {
            const next = current.filter((_, itemIndex) => itemIndex !== index);

            return next.length > 0 ? next : [{ label: '', rate: 0 }];
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payroll settings" />

            <h1 className="sr-only">Payroll settings</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Payroll deductions and salary structure"
                        description="Configure default percentages used when preparing payroll."
                    />

                    <Alert>
                        <AlertTitle>Admin-only configuration</AlertTitle>
                        <AlertDescription>
                            Changes here affect payroll calculations for your
                            whole organization.
                        </AlertDescription>
                    </Alert>

                    <Form
                        {...PayrollSettingsController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-8"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                <section className="space-y-4">
                                    <Heading
                                        variant="small"
                                        title="Salary structure"
                                        description="Percentage split for gross-to-allowance structure."
                                    />

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="basic_salary_percentage">
                                                Basic salary (%)
                                            </Label>
                                            <Input
                                                id="basic_salary_percentage"
                                                name="basic_salary_percentage"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="100"
                                                required
                                                defaultValue={
                                                    settings.basic_salary_percentage
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors.basic_salary_percentage
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="housing_allowance_percentage">
                                                Housing allowance (%)
                                            </Label>
                                            <Input
                                                id="housing_allowance_percentage"
                                                name="housing_allowance_percentage"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="100"
                                                required
                                                defaultValue={
                                                    settings.housing_allowance_percentage
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors.housing_allowance_percentage
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="transport_allowance_percentage">
                                                Transport allowance (%)
                                            </Label>
                                            <Input
                                                id="transport_allowance_percentage"
                                                name="transport_allowance_percentage"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="100"
                                                required
                                                defaultValue={
                                                    settings.transport_allowance_percentage
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors.transport_allowance_percentage
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="other_allowance_percentage">
                                                Other allowance (%)
                                            </Label>
                                            <Input
                                                id="other_allowance_percentage"
                                                name="other_allowance_percentage"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="100"
                                                required
                                                defaultValue={
                                                    settings.other_allowance_percentage
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors.other_allowance_percentage
                                                }
                                            />
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <Heading
                                        variant="small"
                                        title="Statutory deductions"
                                        description="Default rates for pension, NHF, NHIS, and NSITF."
                                    />

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="pension_employee_rate">
                                                Pension employee rate (%)
                                            </Label>
                                            <Input
                                                id="pension_employee_rate"
                                                name="pension_employee_rate"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="100"
                                                required
                                                defaultValue={
                                                    settings.pension_employee_rate
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors.pension_employee_rate
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="pension_employer_rate">
                                                Pension employer rate (%)
                                            </Label>
                                            <Input
                                                id="pension_employer_rate"
                                                name="pension_employer_rate"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="100"
                                                required
                                                defaultValue={
                                                    settings.pension_employer_rate
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors.pension_employer_rate
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="nhf_rate">
                                                NHF rate (%)
                                            </Label>
                                            <Input
                                                id="nhf_rate"
                                                name="nhf_rate"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="100"
                                                required
                                                defaultValue={settings.nhf_rate}
                                            />
                                            <InputError
                                                message={errors.nhf_rate}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="nhis_employee_rate">
                                                NHIS employee rate (%)
                                            </Label>
                                            <Input
                                                id="nhis_employee_rate"
                                                name="nhis_employee_rate"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="100"
                                                required
                                                defaultValue={
                                                    settings.nhis_employee_rate
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors.nhis_employee_rate
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="nhis_employer_rate">
                                                NHIS employer rate (%)
                                            </Label>
                                            <Input
                                                id="nhis_employer_rate"
                                                name="nhis_employer_rate"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="100"
                                                required
                                                defaultValue={
                                                    settings.nhis_employer_rate
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors.nhis_employer_rate
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="nsitf_rate">
                                                NSITF rate (%)
                                            </Label>
                                            <Input
                                                id="nsitf_rate"
                                                name="nsitf_rate"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="100"
                                                required
                                                defaultValue={
                                                    settings.nsitf_rate
                                                }
                                            />
                                            <InputError
                                                message={errors.nsitf_rate}
                                            />
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <Heading
                                        variant="small"
                                        title="Custom percentage fields"
                                        description="Add optional fields such as Others (Specify) with a percentage rate (maximum 5)."
                                    />

                                    <div className="space-y-4">
                                        {customItems.map((item, index) => {
                                            return (
                                                <div
                                                    key={index}
                                                    className="grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-[1fr_160px]"
                                                >
                                                    <div className="grid gap-2">
                                                        <Label
                                                            htmlFor={`other_items_${index}_label`}
                                                        >
                                                            Label
                                                        </Label>
                                                        <Input
                                                            id={`other_items_${index}_label`}
                                                            name={`other_items[${index}][label]`}
                                                            defaultValue={
                                                                item.label
                                                            }
                                                            placeholder="Union dues"
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `other_items.${index}.label`
                                                                ]
                                                            }
                                                        />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label
                                                            htmlFor={`other_items_${index}_rate`}
                                                        >
                                                            Rate (%)
                                                        </Label>
                                                        <Input
                                                            id={`other_items_${index}_rate`}
                                                            name={`other_items[${index}][rate]`}
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            max="100"
                                                            defaultValue={
                                                                item.rate
                                                            }
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `other_items.${index}.rate`
                                                                ]
                                                            }
                                                        />
                                                    </div>

                                                    <div className="md:col-span-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                removeCustomItem(
                                                                    index,
                                                                )
                                                            }
                                                            disabled={
                                                                customItems.length ===
                                                                1
                                                            }
                                                        >
                                                            Remove field
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addCustomItem}
                                        disabled={
                                            customItems.length >=
                                            MAX_CUSTOM_FIELDS
                                        }
                                    >
                                        Add custom field
                                    </Button>

                                    <InputError message={errors.other_items} />
                                </section>

                                <div className="flex items-center gap-4">
                                    <Button disabled={processing}>
                                        Save payroll settings
                                    </Button>

                                    {recentlySuccessful && (
                                        <p className="text-sm text-neutral-600">
                                            Saved
                                        </p>
                                    )}
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
