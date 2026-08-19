export const kpiMetrics = [
  {
    id: "impressions",
    label: "Total Impressions",
    value: "142.8M",
    change: "+12.4%",
    isPositive: true,
    sparkline: [20, 24, 22, 28, 30, 29, 35, 38, 42],
  },
  {
    id: "revenue",
    label: "Staking TVL ($ADG)",
    value: "842,500",
    change: "+8.2%",
    isPositive: true,
    sparkline: [12, 14, 13, 16, 17, 18, 20, 22, 24],
  },
  {
    id: "active",
    label: "Active Placements",
    value: "28 / 32",
    change: "+4.1%",
    isPositive: true,
    sparkline: [25, 26, 26, 27, 28, 28, 27, 28, 28],
  },
  {
    id: "conversion",
    label: "Conversion Rate",
    value: "3.42%",
    change: "-1.8%",
    isPositive: false,
    sparkline: [4.1, 4.0, 3.8, 3.7, 3.6, 3.5, 3.5, 3.45, 3.42],
  }
];

export const campaignList = [
  {
    id: "c-001",
    name: "Neon Horizon Launch",
    client: "Metaverse Corp",
    impressions: "4.2M",
    ctr: "2.85%",
    conversion: "4.1%",
    revenue: "24,500 ADG",
    status: "Live",
    progress: 78,
  },
  {
    id: "c-002",
    name: "Cyber Sneakers NFT Drop",
    client: "Acro Athletics",
    impressions: "8.1M",
    ctr: "3.12%",
    conversion: "5.3%",
    revenue: "48,200 ADG",
    status: "Live",
    progress: 92,
  },
  {
    id: "c-003",
    name: "Decentralized Finance V2",
    client: "Apex Yield",
    impressions: "12.4M",
    ctr: "1.98%",
    conversion: "2.2%",
    revenue: "92,100 ADG",
    status: "Scheduled",
    progress: 0,
  },
  {
    id: "c-004",
    name: "Virtuo VR headset campaign",
    client: "Virtuo Inc",
    impressions: "6.8M",
    ctr: "2.40%",
    conversion: "3.6%",
    revenue: "38,000 ADG",
    status: "Completed",
    progress: 100,
  },
  {
    id: "c-005",
    name: "Staking Pool Expansion Advert",
    client: "ADGENESIS Internal",
    impressions: "2.1M",
    ctr: "1.75%",
    conversion: "1.9%",
    revenue: "0 ADG",
    status: "Paused",
    progress: 45,
  }
];

export const analyticalChartData = {
  dates: [
    "Aug 01", "Aug 02", "Aug 03", "Aug 04", "Aug 05", "Aug 06", "Aug 07", 
    "Aug 08", "Aug 09", "Aug 10", "Aug 11", "Aug 12", "Aug 13", "Aug 14", "Aug 15"
  ],
  impressions: [3.2, 3.5, 4.1, 3.8, 4.5, 5.2, 4.8, 5.5, 6.1, 5.9, 6.4, 7.2, 6.9, 7.8, 8.4],
  conversions: [1.2, 1.4, 1.8, 1.6, 2.1, 2.4, 2.0, 2.6, 2.9, 2.7, 3.1, 3.5, 3.2, 3.7, 4.0],
};
