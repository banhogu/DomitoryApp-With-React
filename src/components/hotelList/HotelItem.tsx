/** @jsxImportSource @emotion/react */
import { Hotel, Hotel as IHotel } from '@/model/hotel';
import ListRow from '../shared/ListRow';
import Flex from '../shared/Flex';
import Text from '../shared/Text';
import Spacing from '../shared/Spacing';
import { css } from '@emotion/react';
import addDelimiter from '@/utils/addDel';
import Tag from '../shared/Tag';
import { differenceInMilliseconds, parseISO } from 'date-fns';
import formatTime from '@/utils/formatTime';
import { MouseEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const HotelItem = ({
  hotel,
  isLike,
  onLike,
}: {
  hotel: IHotel;
  isLike: boolean;
  onLike: ({ hotel }: { hotel: Pick<Hotel, 'name' | 'id' | 'mainImageUrl'> }) => void;
}) => {
  const [remainedTime, setRemainedTime] = useState(0);

  useEffect(() => {
    if (hotel.events == null || hotel.events.promoEndTime == null) {
      return;
    }

    const promoEndTime = hotel.events.promoEndTime;

    const timer = setInterval(() => {
      const 남은초 = differenceInMilliseconds(parseISO(promoEndTime), new Date());

      if (남은초 < 0) {
        clearInterval(timer);
        return;
      }

      setRemainedTime(남은초);
    }, 1_000);

    return () => {
      clearInterval(timer);
    };
  }, [hotel.events]);

  const tagComponent = () => {
    if (hotel.events == undefined) {
      return null;
    }
    const { name, tagThemeStyle } = hotel.events;
    const promotionTxt = remainedTime > 0 ? ` - ${formatTime(remainedTime)} 남음` : '';
    return (
      <div>
        <Tag color={tagThemeStyle.fontColor} backgroundColor={tagThemeStyle.backgroundColor}>
          {name.concat(promotionTxt)}
        </Tag>
        <Spacing size={8} />
      </div>
    );
  };

  const handleLike = (e: MouseEvent<HTMLImageElement>) => {
    e.preventDefault();
    onLike({
      hotel: {
        name: hotel.name,
        mainImageUrl: hotel.mainImageUrl,
        id: hotel.id,
      },
    });
  };

  return (
    <div>
      <Link to={`/hotel/${hotel.id}`}>
        <ListRow
          contents={
            <Flex direction="column">
              {tagComponent()}
              <ListRow.Texts title={hotel.name} subTitle={hotel.comment}></ListRow.Texts>
              <Spacing size={4} />
              <Text typography="t7">{hotel.starRating}성급</Text>
            </Flex>
          }
          right={
            <Flex direction="column" align="flex-end" style={{ position: 'relative' }}>
              <img
                src={
                  isLike
                    ? 'https://cdn4.iconfinder.com/data/icons/twitter-29/512/166_Heart_Love_Like_Twitter-64.png'
                    : 'https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-ios7-heart-outline-64.png'
                }
                alt=""
                css={iconHeartStyles}
                onClick={handleLike}
              />
              <img src={hotel.mainImageUrl} alt="" css={imageStyles} />
              <Spacing size={8} />
              <Text bold={true}>{addDelimiter(hotel.price)}원</Text>
            </Flex>
          }
          style={containerStyles}
          as="li"
        />
      </Link>
    </div>
  );
};

const containerStyles = css`
  align-items: flex-start;
`;

const imageStyles = css`
  width: 90px;
  height: 110px;
  border-radius: 8px;
  object-fit: cover;
  margin-left: 16px;
`;

const iconHeartStyles = css`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 30px;
  height: 30px;
`;

export default HotelItem;
