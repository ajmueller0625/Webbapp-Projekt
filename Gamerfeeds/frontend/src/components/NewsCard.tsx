interface CardData {
  id: number;
  image_url: string;
  title: string;
}

export default function NewsCard({ id, image_url, title }: CardData) {
  return (
    <div className="rounded-md relative h-50 transition-all duration-300 transform hover:scale-105 text-white">
      <img
        src={image_url}
        alt={`Card Image ${id}`}
        className="object-cover w-full h-full rounded-lg"
      />
      <div
        className="absolute bottom-0 left-0 w-full px-3 py-2 bg-neutral-900/50 
               font-[Hubot_Sans] rounded-b-lg"
      >
        <h3 className="text-sm font-bold">{title}</h3>
      </div>
    </div>
  );
}
