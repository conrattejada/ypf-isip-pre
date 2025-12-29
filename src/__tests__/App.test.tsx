import { render, screen } from '@testing-library/react';
import { AppTestWrapper } from '@corva/ui/testing';

import App from '../App';
import { mockApp, mockUser, mockAppHeaderProps } from '../__mocks__/mockData';

describe('<App />', () => {
  it('should show correct layout', () => {
    render(
      <AppTestWrapper
        app={{}}
        appId={123}
        maximized={false}
        appSettings={{}}
        onSettingChange={() => {
          /* noop */
        }}
      >
        <App
          app={mockApp}
          package="test"
          coordinates={{
            w: 0,
            h: 0,
            x: 0,
            y: 0,
            pixelHeight: 0,
            pixelWidth: 0,
          }}
          currentUser={mockUser}
          devCenterRouter={{ location: { pathname: '', query: {} } }}
          segment="test"
          appHeaderProps={mockAppHeaderProps}
          isNative={false}
          layoutEnvironment={{ type: 'test', pdfReportMode: false }}
          onSettingChange={() => {
            /* noop */
          }}
          onSettingsChange={() => {
            /* noop */
          }}
          setIsFullscreenModalMode={() => Promise.resolve()}
          setIsMaximized={() => {
            /* noop */
          }}
          setMainMenuItems={() => {
            /* noop */
          }}
          setSecondaryMenuItems={() => {
            /* noop */
          }}
        />
      </AppTestWrapper>
    );

    screen.getByText(/checked/i);
  });

  it('should show correct layout when settings are not provided', () => {
    render(
      <AppTestWrapper
        app={{}}
        appId={123}
        maximized={false}
        appSettings={{}}
        onSettingChange={() => {
          /* noop */
        }}
      >
        <App
          app={mockApp}
          package="test"
          coordinates={{
            w: 0,
            h: 0,
            x: 0,
            y: 0,
            pixelHeight: 0,
            pixelWidth: 0,
          }}
          currentUser={mockUser}
          devCenterRouter={{ location: { pathname: '', query: {} } }}
          segment="test"
          appHeaderProps={mockAppHeaderProps}
          isNative={false}
          layoutEnvironment={{ type: 'test', pdfReportMode: false }}
          onSettingChange={() => {
            /* noop */
          }}
          onSettingsChange={() => {
            /* noop */
          }}
          setIsFullscreenModalMode={() => Promise.resolve()}
          setIsMaximized={() => {
            /* noop */
          }}
          setMainMenuItems={() => {
            /* noop */
          }}
          setSecondaryMenuItems={() => {
            /* noop */
          }}
        />
      </AppTestWrapper>
    );

    screen.getByText(/unchecked/i);
  });
});
