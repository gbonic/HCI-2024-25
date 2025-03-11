import Image from 'next/image';

type RecipeCardProps = {
  recipe: any;
  onClick: () => void;
};

const RecipeCard = ({ recipe, onClick }: RecipeCardProps) => {
  const imageUrl = recipe.fields.slikaRecepta?.fields?.file?.url ? `https:${recipe.fields.slikaRecepta.fields.file.url}` : recipe.fields.slikaRecepta;

  return (
    <div
      className="bg-white shadow-lg rounded-xl overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer"
      onClick={onClick}
    >
      {recipe.fields.slikaRecepta && (
        <div className="w-full h-48 relative">
          <Image
            src={imageUrl}
            alt={recipe.fields.nazivRecepta}
            layout="fill"
            objectFit="cover"
            className="rounded-t-xl"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-900">{recipe.fields.nazivRecepta}</h2>
        <p className="text-gray-600 mt-2">
          {recipe.fields.opisRecepta ? recipe.fields.opisRecepta.slice(0, 100) + "..." : "Kliknite za više."}
        </p>
      </div>
    </div>
  );
};

export default RecipeCard;