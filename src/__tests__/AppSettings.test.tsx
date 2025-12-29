import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AppSettings from '../AppSettings';
import { mockApp, mockUser, mockAppData } from '../__mocks__/mockData';

describe('<AppSettings />', () => {
  it('should call onChange with a changed setting on settings change', async () => {
    const handleSettingsChange = vi.fn();
    const handleSettingsChangeAll = vi.fn();

    render(
      <AppSettings
        app={mockApp}
        appData={mockAppData}
        settings={{ isExampleCheckboxChecked: true }}
        layoutEnvironment={{ type: 'test', pdfReportMode: false }}
        currentUser={mockUser}
        onSettingChange={handleSettingsChange}
        onSettingsChange={handleSettingsChangeAll}
      />
    );

    const exampleCheckbox = screen.getByRole('checkbox', { name: /example/i });

    await act(async () => {
      await userEvent.click(exampleCheckbox);
    });

    expect(handleSettingsChange).toBeCalledWith(
      'isExampleCheckboxChecked',
      false
    );
  });
});
