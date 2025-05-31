type ChatRoom = {
  id: string;
  name: string;
}

type Props = {
  rooms: ChatRoom[];
  activeRoomId: string;
  onSelectRoom: (roomId: string) => void;
}

export default function ChatSelector({ rooms, activeRoomId, onSelectRoom }: Props) {
  return (
    <div className="flex items-center px-4 py-2 border-b border-primary-pink">
      {rooms.map((room) => (
        <span
          key={room.id}
          className={`mr-2 cursor-pointer ${room.id === activeRoomId ? "text-primary-green" : "text-gray"}`}
          onClick={() => onSelectRoom(room.id)}
        >
          {room.name}
        </span>
      ))}
    </div>
  );
}
