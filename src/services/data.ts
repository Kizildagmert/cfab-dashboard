import { type User } from '../types/index';

export const PROFESSIONS = ['Mühendis', 'Tasarımcı', 'İK Uzmanı', 'Geliştirici', 'Yönetici'];

export const MOCK_USERS: User[] = [
  { id: 1, tckn: '12345678901', firstName: 'Ahmet', lastName: 'Yılmaz', email: 'ahmet@crudfab.com', role: 'admin', profession: 'Yönetici', status: 'active', createdAt: '2023-01-10' },
  { id: 2, tckn: '22345678902', firstName: 'Ayşe', lastName: 'Demir', email: 'ayse@crudfab.com', role: 'user', profession: 'Tasarımcı', status: 'active', createdAt: '2023-02-15' },
  { id: 3, tckn: '32345678903', firstName: 'Mehmet', lastName: 'Kaya', email: 'mehmet@crudfab.com',  role: 'user', profession: 'Mühendis', status: 'passive', createdAt: '2023-03-20' },
  { id: 4, tckn: '42345678904', firstName: 'Zeynep', lastName: 'Çelik', email: 'zeynep@crudfab.com',  role: 'admin', profession: 'İK Uzmanı', status: 'active', createdAt: '2023-04-05' },
  { id: 5, tckn: '52345678905', firstName: 'Can', lastName: 'Öztürk', email: 'can@crudfab.com', role: 'user', profession: 'Geliştirici', status: 'active', createdAt: '2023-05-12' },
  { id: 6, tckn: '62345678906', firstName: 'Elif', lastName: 'Arslan', email: 'elif@crudfab.com', role: 'user', profession: 'Tasarımcı', status: 'passive', createdAt: '2023-06-18' },
  { id: 7, tckn: '72345678907', firstName: 'Burak', lastName: 'Polat', email: 'burak@crudfab.com', role: 'user', profession: 'Mühendis', status: 'active', createdAt: '2023-07-22' },
  { id: 8, tckn: '82345678908', firstName: 'Selin', lastName: 'Koç', email: 'selin@crudfab.com', role: 'admin', profession: 'Yönetici', status: 'active', createdAt: '2023-08-30' },
  { id: 9, tckn: '92345678909', firstName: 'Cem', lastName: 'Uçar', email: 'cem@crudfab.com', role: 'user', profession: 'Geliştirici', status: 'active', createdAt: '2023-09-14' },
  { id: 10, tckn: '10345678910', firstName: 'Gamze', lastName: 'Şahin', email: 'gamze@crudfab.com', role: 'user', profession: 'İK Uzmanı', status: 'passive', createdAt: '2023-10-01' },
  { id: 11, tckn: '11345678911', firstName: 'Okan', lastName: 'Yıldız', email: 'okan@crudfab.com', role: 'user', profession: 'Geliştirici', status: 'active', createdAt: '2023-11-05' },
  { id: 12, tckn: '12345678912', firstName: 'Pelin', lastName: 'Aksoy', email: 'pelin@crudfab.com', role: 'user', profession: 'Tasarımcı', status: 'active', createdAt: '2023-12-10' },
  { id: 13, tckn: '13345678913', firstName: 'Murat', lastName: 'Demirci', email: 'murat@crudfab.com', role: 'user', profession: 'Mühendis', status: 'passive', createdAt: '2024-01-15' },
  { id: 14, tckn: '14345678914', firstName: 'Ece', lastName: 'Güneş', email: 'ece@crudfab.com', role: 'admin', profession: 'İK Uzmanı', status: 'active', createdAt: '2024-02-20' },
  { id: 15, tckn: '15345678915', firstName: 'Hakan', lastName: 'Bulut', email: 'hakan@crudfab.com', role: 'user', profession: 'Geliştirici', status: 'active', createdAt: '2024-03-25' },
];
