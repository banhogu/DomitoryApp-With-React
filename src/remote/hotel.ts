import {
  QuerySnapshot,
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  limit,
  query,
  startAfter,
  where,
} from 'firebase/firestore';
import { store } from './firebase';
import { COLLECTIONS } from '@/constants';
import { Hotel } from '@/model/hotel';
import { Room } from '@/model/room';

export async function getHotels(pageParams?: QuerySnapshot<unknown>) {
  const hotelsQuery =
    pageParams == null
      ? query(collection(store, COLLECTIONS.HOTEL), limit(10))
      : query(collection(store, COLLECTIONS.HOTEL), startAfter(pageParams), limit(10));

  const hotelsSnapshot = await getDocs(hotelsQuery);

  const items = hotelsSnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as Hotel
  );

  const lastVisible = hotelsSnapshot.docs[hotelsSnapshot.docs.length - 1];

  return {
    items,
    lastVisible,
  };
}

export async function getHotel(id: string) {
  const snapshot = await getDoc(doc(store, COLLECTIONS.HOTEL, id));

  return {
    id,
    ...snapshot.data(),
  } as Hotel;
}

export async function getRecommendHotels(hotelIds: string[]) {
  const recommendQuery = query(
    collection(store, COLLECTIONS.HOTEL),
    where(documentId(), 'in', hotelIds)
  );

  const snapshot = await getDocs(recommendQuery);

  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as Hotel
  );
}

export async function getHotelWithRoom({ hotelId, roomId }: { hotelId: string; roomId: string }) {
  const hotelSanpshot = await getDoc(doc(store, COLLECTIONS.HOTEL, hotelId));
  const roomSanpshot = await getDoc(doc(hotelSanpshot.ref, COLLECTIONS.ROOM, roomId));

  return {
    hotel: hotelSanpshot.data() as Hotel,
    room: roomSanpshot.data() as Room,
  };
}
