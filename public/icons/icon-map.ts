import IconAlarm from "public/icons/icon_alarm.svg";
import IconAmount from "public/icons/icon_amount.svg";
import IconArrow_down from "public/icons/icon_arrow_down.svg";
import IconArrow_down02 from "public/icons/icon_arrow_down02.svg";
import IconArrow_left from "public/icons/icon_arrow_left.svg";
import IconArrow_right from "public/icons/icon_arrow_right.svg";
import IconBattery from "public/icons/icon_battery.svg";
import IconBattery02 from "public/icons/icon_battery02.svg";
import IconCheck from "public/icons/icon_check.svg";
import IconClose from "public/icons/icon_close.svg";
import IconDate from "public/icons/icon_date.svg";
import IconDate_g from "public/icons/icon_date_g.svg";
import IconDel from "public/icons/icon_del.svg";
import IconDelete from "public/icons/icon_delete.svg";
import IconDownload from "public/icons/icon_download.svg";
import IconDust from "public/icons/icon_dust.svg";
import IconEdit from "public/icons/icon_edit.svg";
import IconEnergy from "public/icons/icon_energy.svg";
import IconError from "public/icons/icon_error.svg";
import IconEye from "public/icons/icon_eye.svg";
import IconEye_off from "public/icons/icon_eye_off.svg";
import IconFactory from "public/icons/icon_factory.svg";
import IconFactory_w from "public/icons/icon_factory_w.svg";
import IconFeedback from "public/icons/icon_feedback.svg";
import IconGoogle from "public/icons/icon_google.svg";
import IconGroup from "public/icons/icon_group.svg";
import IconHumidity from "public/icons/icon_humidity.svg";
import IconImp from "public/icons/icon_imp.svg";
import IconKakao from "public/icons/icon_kakao.svg";
import IconLink from "public/icons/icon_link.svg";
import IconList from "public/icons/icon_list.svg";
import IconLogout from "public/icons/icon_logout.svg";
import IconMember from "public/icons/icon_member.svg";
import IconMenu from "public/icons/icon_menu.svg";
import IconMenu01 from "public/icons/icon_menu01.svg";
import IconMenu02 from "public/icons/icon_menu02.svg";
import IconMenu03 from "public/icons/icon_menu03.svg";
import IconMenu04 from "public/icons/icon_menu04.svg";
import IconMenu05 from "public/icons/icon_menu05.svg";
import IconMenu06 from "public/icons/icon_menu06.svg";
import IconMenu07 from "public/icons/icon_menu07.svg";
import IconMenu08 from "public/icons/icon_menu08.svg";
import IconMenu09 from "public/icons/icon_menu09.svg";
import IconMenu10 from "public/icons/icon_menu10.svg";
import IconMenu11 from "public/icons/icon_menu11.svg";
import IconNaver from "public/icons/icon_naver.svg";
import IconNormal from "public/icons/icon_normal.svg";
import IconOffline from "public/icons/icon_offline.svg";
import IconPlus from "public/icons/icon_plus.svg";
import IconPower from "public/icons/icon_power.svg";
import IconSave from "public/icons/icon_save.svg";
import IconSearch from "public/icons/icon_search.svg";
import IconSolar from "public/icons/icon_solar.svg";
import IconTemp from "public/icons/icon_temp.svg";
import IconThunder from "public/icons/icon_thunder.svg";
import IconTime from "public/icons/icon_time.svg";
import IconTransfer_left from "public/icons/icon_transfer_left.svg";
import IconTransfer_right from "public/icons/icon_transfer_right.svg";
import IconWarning from "public/icons/icon_warning.svg";
import IconWind from "public/icons/icon_wind.svg";

export const ICON_MAP = {
  alarm: IconAlarm,
  amount: IconAmount,
  arrow_down: IconArrow_down,
  arrow_down02: IconArrow_down02,
  arrow_left: IconArrow_left,
  arrow_right: IconArrow_right,
  battery: IconBattery,
  battery02: IconBattery02,
  check: IconCheck,
  close: IconClose,
  date: IconDate,
  date_g: IconDate_g,
  del: IconDel,
  delete: IconDelete,
  download: IconDownload,
  dust: IconDust,
  edit: IconEdit,
  energy: IconEnergy,
  error: IconError,
  eye: IconEye,
  eye_off: IconEye_off,
  factory: IconFactory,
  factory_w: IconFactory_w,
  feedback: IconFeedback,
  google: IconGoogle,
  group: IconGroup,
  humidity: IconHumidity,
  imp: IconImp,
  kakao: IconKakao,
  link: IconLink,
  list: IconList,
  logout: IconLogout,
  member: IconMember,
  menu: IconMenu,
  menu01: IconMenu01,
  menu02: IconMenu02,
  menu03: IconMenu03,
  menu04: IconMenu04,
  menu05: IconMenu05,
  menu06: IconMenu06,
  menu07: IconMenu07,
  menu08: IconMenu08,
  menu09: IconMenu09,
  menu10: IconMenu10,
  menu11: IconMenu11,
  naver: IconNaver,
  normal: IconNormal,
  offline: IconOffline,
  plus: IconPlus,
  power: IconPower,
  save: IconSave,
  search: IconSearch,
  solar: IconSolar,
  temp: IconTemp,
  thunder: IconThunder,
  time: IconTime,
  transfer_left: IconTransfer_left,
  transfer_right: IconTransfer_right,
  warning: IconWarning,
  wind: IconWind,
} as const;

export type IconName = keyof typeof ICON_MAP;
