import { HotelOutlined } from "@mui/icons-material";

const reservation = {
  id: "group-reservation",
  title: "Reservations",
  type: "group",
  permissions: ["view_book_room"],
  children: [
    {
      id: "bookRoom",
      title: "Book Room",
      type: "item",
      url: "/reservations/book-rooms",
      permission: "view_book_room",
      icon: HotelOutlined,
    },
  ],
};

export default reservation;
