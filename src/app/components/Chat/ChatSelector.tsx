type ChatRoom = {
  id: string;
  name: string;
  hasUnread?: boolean;
}

type Props = {
  rooms: ChatRoom[];
  activeRoomId: string;
  onSelectRoom: (roomId: string) => void;
}

export default function ChatSelector({ rooms, activeRoomId, onSelectRoom }: Props) {
  // rooms.map((room)=> {
  //   console.log(`ChatSelector:, ${room.id}, hasUnread: ${room.hasUnread}`)
  // })
  
  return (
    <div className="flex items-center px-4 py-2 border-b border-primary-pink">
      {rooms.map((room) => (
        <div
          key={room.id}
          className="relative mr-4"
          onClick={() => onSelectRoom(room.id)}
        >
          <span className={`cursor-pointer ${room.id === activeRoomId ? "text-primary-green" : "text-gray"}`}>
            {room.name}
          </span>

          {room.hasUnread && room.id !== activeRoomId && (
            <span className="absolute -top-1 -right-2 block h-2 w-2 rounded-full bg-red-500" />
          )}
        </div>
      ))}
    </div>
  );
}