import BookingRow from "./BookingRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import useBookings from "./useBookings";
import Spinner from "../../ui/Spinner";
import { useSearchParams } from "react-router-dom";

function BookingTable() {
  const { isLoading, bookings } = useBookings();
  const [searchParams] = useSearchParams();
  if (isLoading) return <Spinner />;
  const filterParams = searchParams.get("status") || "all";
  const sortByParams = searchParams.get("sortBy") || "startDate-desc";
  let filterBookings;
  if (filterParams === "all") filterBookings = bookings.booking;
  if (filterParams === "checked-out")
    filterBookings = bookings.booking.filter(
      (booking) => booking.status === "checked-out"
    );
  if (filterParams === "checked-in")
    filterBookings = bookings.booking.filter(
      (booking) => booking.status === "checked-in"
    );
  if (filterParams === "unconfirmed")
    filterBookings = bookings.booking.filter(
      (booking) => booking.status === "unconfirmed"
    );
  const [field, direction] = sortByParams.split("-");
  let sortedBookings;
  const modifier = direction === "asc" ? 1 : -1;
  if (field === "startDate") {
    sortedBookings = filterBookings.sort((a, b) => {
      return (Date.parse(b.startDate) - Date.parse(a.startDate)) * modifier;
    });
  }
  sortedBookings = filterBookings.sort(
    (a, b) => (a[field] - b[field]) * modifier
  );
  return (
    <Menus>
      <Table columns="0.6fr 2fr 2.4fr 1.4fr 1fr 3.2rem">
        <Table.Header>
          <div>Cabin</div>
          <div>Guest</div>
          <div>Dates</div>
          <div>Status</div>
          <div>Amount</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={sortedBookings}
          render={(booking) => (
            <BookingRow key={booking.id} booking={booking} />
          )}
        />
      </Table>
    </Menus>
  );
}

export default BookingTable;
