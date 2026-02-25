import { StyleSheet, Text, type TextProps } from 'react-native';

import { Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'headline' | 'paragraph' | 'footerLink';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'headline' ? styles.headline : undefined,
        type === 'paragraph' ? styles.paragraph : undefined,
        type === 'footerLink' ? styles.footerLink : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    ...Typography.paragraph,
  },
  defaultSemiBold: {
    ...Typography.paragraph,
    fontWeight: '600',
  },
  title: {
    ...Typography.headline,
  },
  subtitle: {
    ...Typography.subtitle,
  },
  link: {
    ...Typography.footerLink,
    color: '#0a7ea4',
  },
  headline: {
    ...Typography.headline,
  },
  paragraph: {
    ...Typography.paragraph,
  },
  footerLink: {
    ...Typography.footerLink,
  },
});
