/* eslint-disable @typescript-eslint/no-empty-function */
import { LoadingIndicator, Modal } from '@corva/ui/components';

import styles from './styles.module.css';

type LoadingModalProps = {
  isOpen: boolean;
  title?: string;
  message?: string;
  size?: 'small' | 'medium' | 'large' | 'extraLarge';
  onClose?: () => void;
};

const Settings = ({
  isOpen,
  title,
  message,
  size = 'small',
  onClose = () => { },
}: LoadingModalProps): JSX.Element => {
  return (
    <Modal open={isOpen} onClose={onClose} title={title} size={size}>
      <div className={styles.indicator}>
        <LoadingIndicator size={64} />
      </div>
      <div className={styles.message}>
        <span>{message}</span>
      </div>
    </Modal>
  );
};

export default Settings;
