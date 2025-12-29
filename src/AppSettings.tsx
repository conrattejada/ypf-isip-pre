import { AppSettingsProps, CustomAppSettings } from './types';

const AppSettings = (
  props: AppSettingsProps & CustomAppSettings
): JSX.Element => {
  return (
    <div>
    </div>
  );
};

// Important: Do not change root component default export (AppSettings.js). Use it as container
//  for your App Settings. It's required to make build and zip scripts work as expected;
export default AppSettings;
