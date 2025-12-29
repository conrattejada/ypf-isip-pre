const getStyleValue = (name: string): string =>
  getComputedStyle(document.body).getPropertyValue(name).trim();

type Color =
  | 'primaryText1'
  | 'primaryText6'
  | 'primaryText7'
  | 'backgroundB5'
  | 'backgroundB8'
  | 'successMain'
  | 'warningMain'
  | 'errorMain'
  | 'infoMain';
export const getColors = (): Record<Color, string> => ({
  primaryText1: getStyleValue('--palette-primary-text-1'),
  primaryText6: getStyleValue('--palette-primary-text-6'),
  primaryText7: getStyleValue('--palette-primary-text-7'),
  backgroundB5: getStyleValue('--palette-background-b-5'),
  backgroundB8: getStyleValue('--palette-background-b-8'),
  successMain: getStyleValue('--palette-success-main'),
  warningMain: getStyleValue('--palette-warning-main'),
  errorMain: getStyleValue('--palette-error-main'),
  infoMain: getStyleValue('--palette-info-main'),
});
