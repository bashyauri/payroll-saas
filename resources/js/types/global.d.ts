import type { Auth } from '@/types/auth';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            flash?: {
                status?: string | null;
                success?: string | null;
                error?: string | null;
                warning?: string | null;
                onboarding_notice?: string | null;
            };
            auth: Auth;
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
    }
}
