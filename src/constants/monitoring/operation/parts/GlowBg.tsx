// 원형 배경 링 UI

const circleSizes = [840, 1040, 1240, 1440, 1640];

const circleStyle = {
  position: 'absolute' as const,
  borderRadius: '50%',
  border: '20px solid #F6F6F6',
  pointerEvents: 'none' as const,
};

const glowStyle = {
  position: 'absolute' as const,
  width: '1640px',
  height: '1640px',
  borderRadius: '50%',
  pointerEvents: 'none' as const,
  background:
    'radial-gradient(circle, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)',
  filter: 'blur(2px)',
};

export const CircleGlowBackground = () => {
  return (
    <>
      {circleSizes.map((size) => (
        <div
          key={size}
          style={{
            ...circleStyle,
            width: `${size}px`,
            height: `${size}px`,
          }}
        />
      ))}
      <div style={glowStyle} />
    </>
  );
};
