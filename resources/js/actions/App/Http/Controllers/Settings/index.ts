import ProfileController from './ProfileController'
import PasswordController from './PasswordController'
import TwoFactorAuthenticationController from './TwoFactorAuthenticationController'
import WorkspaceController from './WorkspaceController'
import PayrollSettingsController from './PayrollSettingsController'
const Settings = {
    ProfileController: Object.assign(ProfileController, ProfileController),
PasswordController: Object.assign(PasswordController, PasswordController),
TwoFactorAuthenticationController: Object.assign(TwoFactorAuthenticationController, TwoFactorAuthenticationController),
WorkspaceController: Object.assign(WorkspaceController, WorkspaceController),
PayrollSettingsController: Object.assign(PayrollSettingsController, PayrollSettingsController),
}

export default Settings