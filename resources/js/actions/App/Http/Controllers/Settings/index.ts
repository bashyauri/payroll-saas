import ProfileController from './ProfileController'
import PasswordController from './PasswordController'
import TwoFactorAuthenticationController from './TwoFactorAuthenticationController'
import WorkspaceController from './WorkspaceController'
import OrganizationProfileController from './OrganizationProfileController'
import OrganizationUsersController from './OrganizationUsersController'
import PayrollSettingsController from './PayrollSettingsController'
const Settings = {
    ProfileController: Object.assign(ProfileController, ProfileController),
PasswordController: Object.assign(PasswordController, PasswordController),
TwoFactorAuthenticationController: Object.assign(TwoFactorAuthenticationController, TwoFactorAuthenticationController),
WorkspaceController: Object.assign(WorkspaceController, WorkspaceController),
OrganizationProfileController: Object.assign(OrganizationProfileController, OrganizationProfileController),
OrganizationUsersController: Object.assign(OrganizationUsersController, OrganizationUsersController),
PayrollSettingsController: Object.assign(PayrollSettingsController, PayrollSettingsController),
}

export default Settings