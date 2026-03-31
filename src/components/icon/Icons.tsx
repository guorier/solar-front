const IconSource = [
  { name: 'alarm', src: '/icons/icon_alarm.svg' },
  { name: 'arrow_down', src: '/icons/icon_arrow_down.svg' },
  { name: 'arrow_down02', src: '/icons/icon_arrow_down02.svg' },
  { name: 'arrow_left', src: '/icons/icon_arrow_left.svg' },
  { name: 'arrow_right', src: '/icons/icon_arrow_right.svg' },
  { name: 'battery', src: '/icons/icon_battery.svg' },
  { name: 'battery02', src: '/icons/icon_battery02.svg' },
  { name: 'check', src: '/icons/icon_check.svg' },
  { name: 'close', src: '/icons/icon_close.svg' },
  { name: 'dust', src: '/icons/icon_dust.svg' },
  { name: 'energy', src: '/icons/icon_energy.svg' },
  { name: 'eye', src: '/icons/icon_eye.svg' },
  { name: 'eye_off', src: '/icons/icon_eye_off.svg' },
  { name: 'factory', src: '/icons/icon_factory.svg' },
  { name: 'feedback', src: '/icons/icon_feedback.svg' },
  { name: 'google', src: '/icons/icon_google.svg' },
  { name: 'humidity', src: '/icons/icon_humidity.svg' },
  { name: 'imp', src: '/icons/icon_imp.svg' },
  { name: 'kakao', src: '/icons/icon_kakao.svg' },
  { name: 'link', src: '/icons/icon_link.svg' },
  { name: 'logout', src: '/icons/icon_logout.svg' },
  { name: 'menu', src: '/icons/icon_menu.svg' },
  { name: 'menu01', src: '/icons/icon_menu01.svg' },
  { name: 'menu02', src: '/icons/icon_menu02.svg' },
  { name: 'menu03', src: '/icons/icon_menu03.svg' },
  { name: 'menu04', src: '/icons/icon_menu04.svg' },
  { name: 'menu05', src: '/icons/icon_menu05.svg' },
  { name: 'menu06', src: '/icons/icon_menu06.svg' },
  { name: 'menu07', src: '/icons/icon_menu07.svg' },
  { name: 'menu08', src: '/icons/icon_menu08.svg' },
  { name: 'menu09', src: '/icons/icon_menu09.svg' },
  { name: 'menu10', src: '/icons/icon_menu10.svg' },
  { name: 'menu11', src: '/icons/icon_menu11.svg' },
  { name: 'naver', src: '/icons/icon_naver.svg' },
  { name: 'plus', src: '/icons/icon_plus.svg' },
  { name: 'power', src: '/icons/icon_power.svg' },
  { name: 'solar', src: '/icons/icon_solar.svg' },
  { name: 'temp', src: '/icons/icon_temp.svg' },
  { name: 'wind', src: '/icons/icon_wind.svg' },
  { name: 'download', src: '/icons/icon_download.svg' },
  { name: 'group', src: '/icons/icon_group.svg' },
  { name: 'delete', src: '/icons/icon_delete.svg' },
  { name: 'list', src: '/icons/icon_list.svg' },
  { name: 'date', src: '/icons/icon_date.svg' },
  { name: 'search', src: '/icons/icon_search.svg' },
  { name: 'del', src: '/icons/icon_del.svg' },
  { name: 'edit', src: '/icons/icon_edit.svg' },
  { name: 'save', src: '/icons/icon_save.svg' },
  { name: 'transfer_right', src: '/icons/icon_transfer_right.svg' },
  { name: 'transfer_left', src: '/icons/icon_transfer_left.svg' },
  { name: 'amount', src: '/icons/icon_amount.svg' },
  { name: 'clock', src: '/icons/icon_time.svg' },
  { name: 'calendar', src: '/icons/icon_date_g.svg' },
  { name: 'thunder', src: '/icons/icon_thunder.svg' },
  { name: 'refresh', src: '/icons/icon_refresh.svg' },
] as const;

export type iName = (typeof IconSource)[number]['name'];

interface IconProps {
  iName: iName;
  size?: number;
  color?: string;
  background?: string;
  className?: string;
  original?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const Icons = ({
  iName,
  original,
  background,
  color = '#374957',
  size = 24,
  className,
  style,
  onClick,
}: IconProps) => {
  const icon = IconSource.find((item) => item.name === iName);

  const iconStyle = !original
    ? {
        display: 'inline-block',
        WebkitMaskImage: `url(${icon?.src})`,
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskSize: 'contain',
        WebkitMaskPosition: 'center',
        width: size,
        height: size,
        background: background ?? color,
      }
    : {
        display: 'inline-block',
        backgroundImage: `url(${icon?.src})`,
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        width: size,
        height: size,
        backgroundColor: color,
      };

  return <i className={className} style={{ ...iconStyle, ...style }} onClick={() => onClick?.()} />;
};
export default Icons;
