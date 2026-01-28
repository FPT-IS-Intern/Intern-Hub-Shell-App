export interface ButtonContainerInterface {
    size: ButtonSize;
    leftIcon?: string;
    rightIcon?: string;
    content: string;
    event?: string;
    fontSize?: string;
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
}

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonSizeConfig {
    minWidth: string;
    minHeight: string;
    fontSize: string;
    iconSize: string;
    contentWidth: string;
    contentHeight: string;
}

export const BUTTON_SIZE_MAP: Record<ButtonSize, ButtonSizeConfig> = {
    xs: {
        minWidth: '47px',
        minHeight: '24px',
        fontSize: 'var(--font-xs)',
        iconSize: '14px',
        contentWidth: '32px',
        contentHeight: '16px',
    },
    sm: {
        minWidth: '96px',
        minHeight: '28px',
        fontSize: 'var(--font-sm)',
        iconSize: '16px',
        contentWidth: '44px',
        contentHeight: '20px',
    },
    md: {
        minWidth: '116px',
        minHeight: '36px',
        fontSize: 'var(--font-sm)',
        iconSize: '20px',
        contentWidth: '52px',
        contentHeight: '20px',
    },
    lg: {
        minWidth: '120px',
        minHeight: '44px',
        fontSize: 'var(--font-sm)',
        iconSize: '20px',
        contentWidth: '52px',
        contentHeight: '20px',
    },
};

