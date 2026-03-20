// New Infographic Templates - Professional & Suitable for Information Graphics

export const newTemplates = `
const templates: Template[] = [
  // Template 1: Statistical Highlights - Big Numbers với Icons
  {
    id: 'statistical-highlights',
    name: 'Thống Kê Nổi Bật',
    category: 'statistics',
    thumbnail: '📊',
    elements: [
      {
        id: 'sh-bg',
        type: 'shape',
        x: 0,
        y: 0,
        width: 800,
        height: 600,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 0,
        shapeType: 'rectangle',
        backgroundColor: '#ffffff',
        opacity: 1
      },
      {
        id: 'sh-title',
        type: 'text',
        x: 50,
        y: 40,
        width: 700,
        height: 70,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 1,
        content: 'Thống Kê Năm 2024',
        fontSize: 48,
        fontWeight: 'bold',
        fontFamily: 'Inter',
        textAlign: 'center',
        color: '#1e293b',
        backgroundColor: 'transparent',
        opacity: 1
      },
      {
        id: 'sh-subtitle',
        type: 'text',
        x: 100,
        y: 105,
        width: 600,
        height: 30,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 1,
        content: 'Những con số ấn tượng đạt được trong năm qua',
        fontSize: 16,
        fontWeight: 'normal',
        fontFamily: 'Inter',
        textAlign: 'center',
        color: '#64748b',
        backgroundColor: 'transparent',
        opacity: 1
      },
      // 4 stat boxes với icons
      ...Array.from({ length: 4 }, (_, i) => {
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
        const icons = ['👥', '💰', '📈', '⭐'];
        const values = ['1.2M+', '₫45 tỷ', '+285%', '4.9/5'];
        const labels = ['Người dùng', 'Doanh thu', 'Tăng trưởng', 'Đánh giá'];
        
        return [
          {
            id: \`sh-box-\${i}\`,
            type: 'shape' as const,
            x: 60 + (i % 2) * 360,
            y: 170 + Math.floor(i / 2) * 200,
            width: 320,
            height: 160,
            rotation: 0,
            locked: false,
            visible: true,
            zIndex: 1,
            shapeType: 'rounded-rect' as const,
            backgroundColor: '#f8fafc',
            borderRadius: 20,
            opacity: 1,
            borderWidth: 2,
            borderColor: colors[i],
            borderStyle: 'solid' as const
          },
          {
            id: \`sh-icon-\${i}\`,
            type: 'text' as const,
            x: 80 + (i % 2) * 360,
            y: 190 + Math.floor(i / 2) * 200,
            width: 60,
            height: 60,
            rotation: 0,
            locked: false,
            visible: true,
            zIndex: 2,
            content: icons[i],
            fontSize: 48,
            fontWeight: 'normal',
            fontFamily: 'Inter',
            textAlign: 'center' as const,
            color: colors[i],
            backgroundColor: 'transparent',
            opacity: 1
          },
          {
            id: \`sh-value-\${i}\`,
            type: 'text' as const,
            x: 150 + (i % 2) * 360,
            y: 195 + Math.floor(i / 2) * 200,
            width: 210,
            height: 50,
            rotation: 0,
            locked: false,
            visible: true,
            zIndex: 2,
            content: values[i],
            fontSize: 44,
            fontWeight: 'bold',
            fontFamily: 'Inter',
            textAlign: 'left' as const,
            color: colors[i],
            backgroundColor: 'transparent',
            opacity: 1
          },
          {
            id: \`sh-label-\${i}\`,
            type: 'text' as const,
            x: 150 + (i % 2) * 360,
            y: 250 + Math.floor(i / 2) * 200,
            width: 210,
            height: 30,
            rotation: 0,
            locked: false,
            visible: true,
            zIndex: 2,
            content: labels[i],
            fontSize: 18,
            fontWeight: 'medium',
            fontFamily: 'Inter',
            textAlign: 'left' as const,
            color: '#475569',
            backgroundColor: 'transparent',
            opacity: 1
          }
        ];
      }).flat()
    ]
  },
  
  // Template 2: Vertical Timeline - Timeline dọc với milestones
  {
    id: 'vertical-timeline',
    name: 'Dòng Thời Gian',
    category: 'timeline',
    thumbnail: '📅',
    elements: [
      {
        id: 'vt-title',
        type: 'text',
        x: 50,
        y: 30,
        width: 700,
        height: 60,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 0,
        content: 'Lịch Sử Phát Triển',
        fontSize: 46,
        fontWeight: 'bold',
        fontFamily: 'Inter',
        textAlign: 'center',
        color: '#0f172a',
        backgroundColor: 'transparent',
        opacity: 1
      },
      // Central vertical line
      {
        id: 'vt-line',
        type: 'shape',
        x: 395,
        y: 110,
        width: 6,
        height: 460,
        rotation: 0,
        locked: false,
        visible: true,
        zIndex: 1,
        shapeType: 'rectangle',
        backgroundGradient: {
          enabled: true,
          type: 'linear',
          angle: 180,
          stops: [
            { color: '#3b82f6', position: 0 },
            { color: '#8b5cf6', position: 100 }
          ]
        },
        borderRadius: 3,
        opacity: 1
      },
      // Timeline milestones
      ...Array.from({ length: 5 }, (_, i) => {
        const isLeft = i % 2 === 0;
        const years = ['2020', '2021', '2022', '2023', '2024'];
        const titles = ['Thành lập', 'Ra mắt sản phẩm', 'Mở rộng thị trường', 'Đạt 1 triệu user', 'Dẫn đầu ngành'];
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
        
        return [
          // Dot on timeline
          {
            id: \`vt-dot-\${i}\`,
            type: 'shape' as const,
            x: 378,
            y: 120 + i * 90,
            width: 40,
            height: 40,
            rotation: 0,
            locked: false,
            visible: true,
            zIndex: 3,
            shapeType: 'circle' as const,
            backgroundColor: colors[i],
            opacity: 1,
            borderWidth: 4,
            borderColor: '#ffffff',
            borderStyle: 'solid' as const,
            shadow: {
              enabled: true,
              x: 0,
              y: 4,
              blur: 12,
              spread: 0,
              color: 'rgba(0, 0, 0, 0.15)'
            }
          },
          // Content card
          {
            id: \`vt-card-\${i}\`,
            type: 'shape' as const,
            x: isLeft ? 80 : 440,
            y: 110 + i * 90,
            width: 280,
            height: 70,
            rotation: 0,
            locked: false,
            visible: true,
            zIndex: 2,
            shapeType: 'rounded-rect' as const,
            backgroundColor: '#ffffff',
            borderRadius: 12,
            opacity: 1,
            borderWidth: 2,
            borderColor: colors[i],
            borderStyle: 'solid' as const,
            shadow: {
              enabled: true,
              x: 0,
              y: 2,
              blur: 8,
              spread: 0,
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          // Year
          {
            id: \`vt-year-\${i}\`,
            type: 'text' as const,
            x: (isLeft ? 80 : 440) + 15,
            y: 120 + i * 90,
            width: 80,
            height: 25,
            rotation: 0,
            locked: false,
            visible: true,
            zIndex: 3,
            content: years[i],
            fontSize: 18,
            fontWeight: 'bold',
            fontFamily: 'Inter',
            textAlign: 'left' as const,
            color: colors[i],
            backgroundColor: 'transparent',
            opacity: 1
          },
          // Title
          {
            id: \`vt-title-\${i}\`,
            type: 'text' as const,
            x: (isLeft ? 80 : 440) + 15,
            y: 145 + i * 90,
            width: 250,
            height: 30,
            rotation: 0,
            locked: false,
            visible: true,
            zIndex: 3,
            content: titles[i],
            fontSize: 15,
            fontWeight: 'medium',
            fontFamily: 'Inter',
            textAlign: 'left' as const,
            color: '#1e293b',
            backgroundColor: 'transparent',
            opacity: 1
          }
        ];
      }).flat()
    ]
  }
];
`;
