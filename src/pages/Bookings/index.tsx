import reservationApi from "@/api/reservationApi";
import BookingItem from "@/components/Bookings/BookingItem";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { parkingLotActions } from "@/store/reducers/parkingLotSlice";
import { selectAuth, selectParkingLot } from "@/store/selectors";
import { Card, Checkbox, Col, Empty, Row, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import type { CheckboxValueType } from "antd/es/checkbox/Group";

const { Option } = Select;

const checkboxOptions = [
  { label: "Scheduled", value: "scheduled" },
  { label: "Ongoing", value: "ongoing" },
  { label: "End", value: "end" },
];

const Bookings = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [dataSoure, setDataSource] = useState<Reservation[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [parkingLotState, setparkingLotState] = useState<ParkingLot[]>([]);
  const handleChange = async (id: string) => {
    fetch(`http://localhost:3001/ticket/get-all?parking_lot_id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(res);
      })
      .then((res) => {
        console.log(res.data);
        setDataSource(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCheckboxChange = (checkedValues: CheckboxValueType[]) => {
    const filterData = reservations.filter((reservation) =>
      checkedValues.includes(reservation.state),
    );
    setDataSource(filterData);
  };

  // const hanldeSort = (value: string) => {
  //   const sortedData = dataSoure;
  //   if (value == "lasted") {
  //     sortedData.sort((first, second) =>
  //       dayjs(first.bookingDate).isAfter(dayjs(second.bookingDate), "day") ? -1 : 1,
  //     );
  //   } else {
  //     sortedData.sort((first, second) =>
  //       dayjs(first.bookingDate).isBefore(dayjs(second.bookingDate), "day") ? -1 : 1,
  //     );
  //   }
  //   setDataSource(sortedData);
  // };

  //   useEffect(() => {
  //     setDataSource(reservations);
  //   }, [reservations]);

  useEffect(() => {
    let idCompany = localStorage.getItem("COMPANY_ID");
    fetch(`http://localhost:3001/parking-lot/get-list?company_id=${idCompany}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(res);
      })
      .then((res) => {
        console.log(res.data);
        setparkingLotState(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <h1>Booking</h1>
      <Card className="mb-4">
        <Row gutter={[20, 20]}>
          <Col span={12}>
            <Select
              size="large"
              placeholder="Select parking lot"
              className="w-full"
              onChange={handleChange}>
              {parkingLotState.map((parkingLot) => (
                <Option value={parkingLot.id} key={parkingLot.id}>
                  {parkingLot.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={12}>
            {/* <Select placeholder="Sort" style={{ width: 120 }} onChange={hanldeSort}>
              <Option value="lastest">Lastest date</Option>
              <Option value="earliest">Earliest date</Option>
            </Select> */}
          </Col>
          {/* <Col span={12}>
            <Checkbox.Group
              defaultValue={["scheduled", "ongoing", "end"]}
              options={checkboxOptions}
              onChange={handleCheckboxChange}
            />
          </Col> */}
        </Row>
      </Card>
      <Card>
        {isLoading && <Spin size="large" />}
        <Row gutter={[20, 20]}>
          {dataSoure.length > 0 ? (
            dataSoure?.map((reservation: Reservation) => (
              <Col span={8} key={reservation.id}>
                <BookingItem reservation={reservation} />
              </Col>
            ))
          ) : (
            <Col span={24}>
              <Empty className="justify-center" />
            </Col>
          )}
        </Row>
      </Card>
    </div>
  );
};

export default Bookings;
