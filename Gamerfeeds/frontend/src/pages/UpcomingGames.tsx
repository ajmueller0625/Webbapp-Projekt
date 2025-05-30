import { useEffect, useState } from "react";
import useGameStore from "../store/gameStore";
import GameCard from "../components/GameCard";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Filter } from "lucide-react";
import FilterDropdown from "../components/FilterDropdown";
import Pagination from "../components/Pagination";

export default function UpcomingGames() {
  const {
    upcomingGames,
    developers,
    platforms,
    genres,
    languages,
    pagination,
    isUpcomingGamesLoading,
    isDevelopersLoading,
    isPlatformsLoading,
    isGenresLoading,
    isLanguagesLoading,
    upcomingGamesError,
    developersError,
    platformsError,
    genresError,
    languagesError,
    fetchUpcomingGames,
    fetchDevelopers,
    fetchPlatforms,
    fetchGenres,
    fetchLanguages,
  } = useGameStore();

  // Use URL search params to store pagination and filter state
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Initialize state from URL search params
  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams.get("page");
    return page ? parseInt(page) : 1;
  });

  const [developersFilters, setDevelopersFilters] = useState<string[]>(() => {
    const developers = searchParams.get("developers");
    return developers ? developers.split(",") : [];
  });

  const [platformsFilters, setPlatformsFilters] = useState<string[]>(() => {
    const platforms = searchParams.get("platforms");
    return platforms ? platforms.split(",") : [];
  });

  const [genresFilters, setGenresFilters] = useState<string[]>(() => {
    const genres = searchParams.get("genres");
    return genres ? genres.split(",") : [];
  });

  const [languagesFilters, setLanguagesFilters] = useState<string[]>(() => {
    const languages = searchParams.get("languages");
    return languages ? languages.split(",") : [];
  });

  const itemsPerPage = 12;

  // Load filter options
  useEffect(() => {
    fetchDevelopers();
    fetchPlatforms();
    fetchGenres();
    fetchLanguages();
  }, [fetchDevelopers, fetchPlatforms, fetchGenres, fetchLanguages]);

  // Update URL when filters or pagination change
  useEffect(() => {
    const params = new URLSearchParams();

    if (currentPage > 1) {
      params.set("page", currentPage.toString());
    }

    if (developersFilters.length > 0) {
      params.set("developers", developersFilters.join(","));
    }

    if (platformsFilters.length > 0) {
      params.set("platforms", platformsFilters.join(","));
    }

    if (genresFilters.length > 0) {
      params.set("genres", genresFilters.join(","));
    }

    if (languagesFilters.length > 0) {
      params.set("languages", languagesFilters.join(","));
    }

    // Update URL without causing a navigation/reload
    setSearchParams(params);
  }, [
    currentPage,
    developersFilters,
    platformsFilters,
    genresFilters,
    languagesFilters,
    setSearchParams,
  ]);

  // Fetch games with current pagination and filters
  useEffect(() => {
    const developersFilterString = developersFilters.join(",");
    const platformsFilterString = platformsFilters.join(",");
    const genresFilterString = genresFilters.join(",");
    const languagesFilterString = languagesFilters.join(",");

    fetchUpcomingGames(
      currentPage,
      itemsPerPage,
      developersFilterString || undefined,
      platformsFilterString || undefined,
      genresFilterString || undefined,
      languagesFilterString || undefined
    );
  }, [
    fetchUpcomingGames,
    currentPage,
    itemsPerPage,
    developersFilters,
    platformsFilters,
    genresFilters,
    languagesFilters,
  ]);

  const handlePageChange = (pageNumber: number) => {
    const validPage = Math.max(
      1,
      Math.min(pageNumber, pagination?.total_pages || 1)
    );
    setCurrentPage(validPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDevelopersToggle = (developerName: string) => {
    setDevelopersFilters((prev) => {
      if (prev.includes(developerName)) {
        return prev.filter((s) => s !== developerName);
      } else {
        return [...prev, developerName];
      }
    });
    setCurrentPage(1);
  };

  const handlePlatformsToggle = (platformName: string) => {
    setPlatformsFilters((prev) => {
      if (prev.includes(platformName)) {
        return prev.filter((s) => s !== platformName);
      } else {
        return [...prev, platformName];
      }
    });
    setCurrentPage(1);
  };

  const handleGenresToggle = (genreName: string) => {
    setGenresFilters((prev) => {
      if (prev.includes(genreName)) {
        return prev.filter((s) => s !== genreName);
      } else {
        return [...prev, genreName];
      }
    });
    setCurrentPage(1);
  };

  const handleLanguagesToggle = (languageName: string) => {
    setLanguagesFilters((prev) => {
      if (prev.includes(languageName)) {
        return prev.filter((s) => s !== languageName);
      } else {
        return [...prev, languageName];
      }
    });
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setDevelopersFilters([]);
    setPlatformsFilters([]);
    setGenresFilters([]);
    setLanguagesFilters([]);
    setCurrentPage(1);
    // Clear all search params by navigating to the base URL
    navigate("/upcominggames");
  };

  if (isUpcomingGamesLoading) {
    return (
      <div className="flex justify-center items-center py-12 min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 spinner-color"></div>
      </div>
    );
  }

  if (upcomingGamesError) {
    return (
      <div className="text-red-500 text-center p-5">
        Error: {upcomingGamesError}
      </div>
    );
  }

  if (
    upcomingGames.length === 0 &&
    developersFilters.length === 0 &&
    platformsFilters.length === 0 &&
    genresFilters.length === 0 &&
    languagesFilters.length === 0
  ) {
    return <div className="text-white text-center p-5">No games available</div>;
  }

  return (
    <div className="flex flex-row justify-between gap-10 mt-25 mb-10 z-10 max-w-7xl w-full mx-auto">
      <div className="w-3/4">
        <h1 className="font-[Black_Ops_One] text-3xl div-header pb-1 mb-5">
          Upcoming Games
        </h1>

        {/* Game card section */}
        {upcomingGames.length > 0 ? (
          <>
            <div className="grid grid-cols-4 gap-5">
              {upcomingGames.map((game) => (
                <Link to={`/games/${game.id}`} key={game.id} className="h-85">
                  <GameCard
                    name={game.name}
                    cover_image_url={game.cover_image_url}
                    release_date={new Date(game.release_date)}
                    rating={game.rating}
                  />
                </Link>
              ))}
            </div>

            {/* Pagination component */}
            {pagination && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.total_pages}
                onPageChange={handlePageChange}
                className="mt-8"
              />
            )}
          </>
        ) : (
          <div className="px-5 py-8 card-background rounded-lg flex flex-col items-center justify-center gap-2">
            <p className="text-xl font-bold">
              No games matching the selected filters
            </p>
            <p className="text-lg">Try adjusting your filters or</p>
            <button
              onClick={resetFilters}
              className="filter-button px-4 py-2 rounded-md hover:cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Filter Side*/}
      <div className="flex flex-col gap-3 mt-3 w-1/4">
        <div className="font-[Black_Ops_One] text-xl div-header flex gap-1 items-center">
          <h1>Filter</h1>
          <Filter size={20} className="mb-1" />
        </div>
        <div className="flex flex-col p-4 card-background rounded-lg gap-4">
          {/* FilterDropdown component */}
          <FilterDropdown
            label="Developers"
            options={developers}
            selectedOptions={developersFilters}
            isLoading={isDevelopersLoading}
            error={developersError}
            onToggleOption={handleDevelopersToggle}
          />

          <FilterDropdown
            label="Platforms"
            options={platforms}
            selectedOptions={platformsFilters}
            isLoading={isPlatformsLoading}
            error={platformsError}
            onToggleOption={handlePlatformsToggle}
          />

          <FilterDropdown
            label="Genres"
            options={genres}
            selectedOptions={genresFilters}
            isLoading={isGenresLoading}
            error={genresError}
            onToggleOption={handleGenresToggle}
          />

          <FilterDropdown
            label="Languages"
            options={languages}
            selectedOptions={languagesFilters}
            isLoading={isLanguagesLoading}
            error={languagesError}
            onToggleOption={handleLanguagesToggle}
          />

          {/* Reset filters button */}
          <button
            onClick={resetFilters}
            className="filter-button px-4 py-2 rounded-md hover:cursor-pointer mt-2 w-full"
          >
            Reset Filters
          </button>

          <p className="text-sm p-1 text-center">
            Showing {upcomingGames.length} of {pagination?.total_items || 0}{" "}
            games
          </p>
        </div>
      </div>
    </div>
  );
}
