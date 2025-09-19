'use client';

import { useState } from 'react';

type Benefit = {
  title: string;
  description: string;
  image: string;
  plans: ('PLATINUM' | 'BUSINESS' | 'INDIVIDUAL')[];
};

const benefits: Benefit[] = [
  {
    title: '会員限定グッズ',
    description: '会員しか持っていない、限定グッズをプレゼント！',
    image: 'http://ik-alumni-cgt.com/wp-content/uploads/2025/07/IMG_3582-scaled.jpg',
    plans: ['PLATINUM', 'BUSINESS', 'INDIVIDUAL']
  },
  {
    title: 'コンサート映像の配信',
    description: '過去のコンサート映像から、最新のコンサート映像までいつでもどこでもご覧いただけます！',
    image: 'http://ik-alumni-cgt.com/wp-content/uploads/2025/07/3O6A8935.jpg',
    plans: ['PLATINUM', 'BUSINESS', 'INDIVIDUAL']
  },
  {
    title: '会員ページ限定コンテンツ',
    description: 'イベントの様子や、SNSでは発信していない限定コンテンツをお届けします！',
    image: 'http://ik-alumni-cgt.com/wp-content/uploads/2025/07/fcd9a261c2f0348d1f29ddfb2a06cc8c-scaled.jpg',
    plans: ['PLATINUM', 'BUSINESS', 'INDIVIDUAL']
  },
  {
    title: '会報の配信',
    description: '活動内容の報告や、イベントの最新情報をお届けします！',
    image: 'http://ik-alumni-cgt.com/wp-content/uploads/2025/06/後援会ロゴ　訂正-4-scaled.png',
    plans: ['PLATINUM', 'BUSINESS', 'INDIVIDUAL']
  },
  {
    title: 'コンサート優先入場権',
    description: '2月に行われる自主公演にて、他のお客様よりも一足先に、入場をし、席を確保することができます！',
    image: 'http://ik-alumni-cgt.com/wp-content/uploads/2025/07/117213171e45978db06a80dbc1715843-scaled.jpg',
    plans: ['PLATINUM', 'BUSINESS', 'INDIVIDUAL']
  },
  {
    title: 'ホームページへの掲載',
    description: '企業様向けに、企業のロゴとHPをALUMNI HPおよびALUMNI CGT Supporter\'s Club HPに掲載することができます！',
    image: 'http://ik-alumni-cgt.com/wp-content/uploads/2025/06/後援会ロゴ　訂正-4-scaled.png',
    plans: ['PLATINUM', 'BUSINESS']
  },
  {
    title: 'コンサートプログラムへの掲載（企業名）',
    description: '支援してくださる企業様向けに、コンサートプログラムへの掲載をいたします。',
    image: 'http://ik-alumni-cgt.com/wp-content/uploads/2025/07/IMG_2202-scaled.jpg',
    plans: ['PLATINUM', 'BUSINESS']
  },
  {
    title: '企業ロゴ入りオリジナルフラッグ',
    description: '企業のロゴが入ったオリジナルフラッグを作成します！',
    image: 'http://ik-alumni-cgt.com/wp-content/uploads/2025/07/IMG_2221-scaled.jpg',
    plans: ['PLATINUM', 'BUSINESS']
  },
  {
    title: 'コンサートプログラムへの広告掲載',
    description: '2月に行われる自主公演のプログラムに、企業様の広告を掲載することができます。',
    image: 'http://ik-alumni-cgt.com/wp-content/uploads/2025/07/IMG_2202-scaled.jpg',
    plans: ['PLATINUM']
  },
  {
    title: 'プラチナ会員限定オリジナルウェア',
    description: 'プラチナ会員限定のオリジナルウェアをプレゼントします。（1着）',
    image: 'http://ik-alumni-cgt.com/wp-content/uploads/2025/06/後援会ロゴ　訂正-4-scaled.png',
    plans: ['PLATINUM']
  },
  {
    title: 'メンバーからのお礼動画',
    description: 'メンバーからのオリジナルお礼動画を配信します！',
    image: 'http://ik-alumni-cgt.com/wp-content/uploads/2025/07/IMG_5737-scaled.jpg',
    plans: ['PLATINUM']
  }
];

export default function BenefitsAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'PLATINUM':
        return 'bg-yellow-500';
      case 'BUSINESS':
        return 'bg-red-500';
      case 'INDIVIDUAL':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-0">
      {benefits.map((benefit, index) => (
        <div key={index} className="border-t border-b border-gray-300 py-4">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleAccordion(index)}
          >
            <span className="text-base font-bold text-gray-800">{benefit.title}</span>
            <span className="text-xl font-bold text-gray-600">
              {openIndex === index ? '−' : '＋'}
            </span>
          </div>
          
          {openIndex === index && (
            <div className="mt-4">
              <div className="flex flex-col md:flex-row gap-5">
                <div className="md:w-2/5">
                  <img
                    src={benefit.image}
                    alt={benefit.title}
                    className="w-full h-auto rounded"
                  />
                </div>
                <div className="md:w-3/5">
                  <p className="text-gray-700 mb-4">{benefit.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {benefit.plans.map((plan) => (
                      <span
                        key={plan}
                        className={`inline-block px-3 py-1.5 rounded-lg text-white font-bold text-sm ${getPlanColor(plan)}`}
                      >
                        {plan}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}