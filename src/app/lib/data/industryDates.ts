export type Industry = 'ecommerce' | 'general' | 'health' | 'sports' | 'tech' | 'fashion' | 'food';

export interface IndustryDate {
  title: string;
  date: string;
  description: string;
  type: 'sale' | 'holiday' | 'event' | 'awareness';
}

export const industryDates: Record<Industry, IndustryDate[]> = {
  ecommerce: [
    {
      title: 'Black Friday',
      date: '2024-11-29',
      description: 'Major shopping event after Thanksgiving',
      type: 'sale'
    },
    {
      title: 'Cyber Monday',
      date: '2024-12-02',
      description: 'Online shopping event after Black Friday',
      type: 'sale'
    },
    {
      title: 'Amazon Prime Day',
      date: '2024-07-16',
      description: 'Amazon\'s major shopping event',
      type: 'sale'
    },
    {
      title: 'Mother\'s Day',
      date: '2024-05-12',
      description: 'Gift-giving holiday',
      type: 'holiday'
    },
    {
      title: 'Father\'s Day',
      date: '2024-06-16',
      description: 'Gift-giving holiday',
      type: 'holiday'
    },
    {
      title: 'Christmas',
      date: '2024-12-25',
      description: 'Major gift-giving holiday',
      type: 'holiday'
    }
  ],
  sports: [
    {
      title: 'Summer Olympics',
      date: '2024-07-26',
      description: '2024 Paris Olympics',
      type: 'event'
    },
    {
      title: 'UEFA Euro 2024',
      date: '2024-06-14',
      description: 'European Football Championship',
      type: 'event'
    },
    {
      title: 'Super Bowl LVIII',
      date: '2024-02-11',
      description: 'NFL Championship Game',
      type: 'event'
    },
    {
      title: 'FIFA World Cup 2026',
      date: '2026-06-11',
      description: 'FIFA World Cup in North America',
      type: 'event'
    }
  ],
  health: [
    {
      title: 'World Health Day',
      date: '2024-04-07',
      description: 'WHO\'s annual health awareness day',
      type: 'awareness'
    },
    {
      title: 'Mental Health Awareness Month',
      date: '2024-05-01',
      description: 'Month-long mental health awareness campaign',
      type: 'awareness'
    },
    {
      title: 'World Diabetes Day',
      date: '2024-11-14',
      description: 'Global diabetes awareness day',
      type: 'awareness'
    }
  ],
  general: [
    {
      title: 'New Year\'s Day',
      date: '2024-01-01',
      description: 'Start of the new year',
      type: 'holiday'
    },
    {
      title: 'Valentine\'s Day',
      date: '2024-02-14',
      description: 'Day of love and romance',
      type: 'holiday'
    },
    {
      title: 'Halloween',
      date: '2024-10-31',
      description: 'Spooky holiday',
      type: 'holiday'
    }
  ],
  tech: [
    {
      title: 'CES 2024',
      date: '2024-01-09',
      description: 'Consumer Electronics Show',
      type: 'event'
    },
    {
      title: 'Apple WWDC',
      date: '2024-06-10',
      description: 'Apple Worldwide Developers Conference',
      type: 'event'
    },
    {
      title: 'Google I/O',
      date: '2024-05-14',
      description: 'Google\'s annual developer conference',
      type: 'event'
    }
  ],
  fashion: [
    {
      title: 'New York Fashion Week',
      date: '2024-02-09',
      description: 'Fall/Winter Fashion Week',
      type: 'event'
    },
    {
      title: 'Paris Fashion Week',
      date: '2024-02-26',
      description: 'Fall/Winter Fashion Week',
      type: 'event'
    },
    {
      title: 'Met Gala',
      date: '2024-05-06',
      description: 'Annual fundraising gala for the Metropolitan Museum of Art',
      type: 'event'
    }
  ],
  food: [
    {
      title: 'National Pizza Day',
      date: '2024-02-09',
      description: 'Celebration of pizza',
      type: 'awareness'
    },
    {
      title: 'World Food Day',
      date: '2024-10-16',
      description: 'UN Food and Agriculture Organization\'s awareness day',
      type: 'awareness'
    },
    {
      title: 'Thanksgiving',
      date: '2024-11-28',
      description: 'Traditional harvest festival',
      type: 'holiday'
    }
  ]
}; 