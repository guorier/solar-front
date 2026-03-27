import IconAlarm from "./icon_alarm.svg";
import IconArrow_down from "./icon_arrow_down.svg";
import IconArrow_down02 from "./icon_arrow_down02.svg";
import IconArrow_left from "./icon_arrow_left.svg";
import IconArrow_right from "./icon_arrow_right.svg";
import IconBattery from "./icon_battery.svg";
import IconBattery02 from "./icon_battery02.svg";
import IconCheck from "./icon_check.svg";
import IconClose from "./icon_close.svg";
import IconDust from "./icon_dust.svg";
import IconEnergy from "./icon_energy.svg";
import IconEye from "./icon_eye.svg";
import IconEye_off from "./icon_eye_off.svg";
import IconFactory from "./icon_factory.svg";
import IconFeedback from "./icon_feedback.svg";
import IconGoogle from "./icon_google.svg";
import IconHumidity from "./icon_humidity.svg";
import IconImp from "./icon_imp.svg";
import IconKakao from "./icon_kakao.svg";
import IconLink from "./icon_link.svg";
import IconLogout from "./icon_logout.svg";
import IconMenu from "./icon_menu.svg";
import IconMenu01 from "./icon_menu01.svg";
import IconMenu02 from "./icon_menu02.svg";
import IconMenu03 from "./icon_menu03.svg";
import IconMenu04 from "./icon_menu04.svg";
import IconMenu05 from "./icon_menu05.svg";
import IconMenu06 from "./icon_menu06.svg";
import IconMenu07 from "./icon_menu07.svg";
import IconMenu08 from "./icon_menu08.svg";
import IconMenu09 from "./icon_menu09.svg";
import IconMenu10 from "./icon_menu10.svg";
import IconMenu11 from "./icon_menu11.svg";
import IconNaver from "./icon_naver.svg";
import IconPlus from "./icon_plus.svg";
import IconPower from "./icon_power.svg";
import IconSolar from "./icon_solar.svg";
import IconTemp from "./icon_temp.svg";
import IconWind from "./icon_wind.svg";
import IconGroup from "./icon_group.svg";
import IconMember from "./icon_member.svg";
import IconDownload from "./icon_download.svg";
import IconDelete from "./icon_delete.svg";
import IconList from "./icon_list.svg";
import IconDate from "./icon_date.svg";
import IconSearch from "./icon_search.svg";
import IconDel from "./icon_del.svg";
import IconEdit from "./icon_edit.svg";
import IconSave from "./icon_save.svg";
import IconTransferRight from "./icon_transfer_right.svg";
import IconTransferLeft from "./icon_transfer_left.svg";
import IconAmount from "./icon_amount.svg";
import IconThunder from "./icon_thunder.svg";

export const ICON_MAP = {
  alarm: IconAlarm,
  arrow_down: IconArrow_down,
  arrow_down02: IconArrow_down02,
  arrow_left: IconArrow_left,
  arrow_right: IconArrow_right,
  battery: IconBattery,
  battery02: IconBattery02,
  check: IconCheck,
  close: IconClose,
  dust: IconDust,
  energy: IconEnergy,
  eye: IconEye,
  eye_off: IconEye_off,
  factory: IconFactory,
  feedback: IconFeedback,
  google: IconGoogle,
  humidity: IconHumidity,
  imp: IconImp,
  kakao: IconKakao,
  link: IconLink,
  logout: IconLogout,
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
  plus: IconPlus,
  power: IconPower,
  solar: IconSolar,
  temp: IconTemp,
  wind: IconWind,
  group: IconGroup,
  member: IconMember,
  download: IconDownload,
  delete: IconDelete,
  list: IconList,
  date: IconDate,
  search: IconSearch,
  del: IconDel,
  edit: IconEdit,
  save: IconSave,
  transfer_right: IconTransferRight,
  transfer_left: IconTransferLeft,
  amount: IconAmount,
  thunder: IconThunder

} as const;

export type IconName = keyof typeof ICON_MAP;
