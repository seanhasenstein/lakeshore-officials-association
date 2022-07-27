import styled from 'styled-components';

export default function Search() {
  return (
    <SearchStyles>
      <label htmlFor="search">Search for an official:</label>
      <div className="input-group">
        <span className="icon" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Start typing..."
          className="search-input"
        />
      </div>
    </SearchStyles>
  );
}

const SearchStyles = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  label {
    margin: 0 0 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.075em;
    color: #1f2937;
  }

  .input-group {
    position: relative;
    display: flex;
    align-items: center;
  }

  .icon {
    position: absolute;
    top: 0.53125rem;
    left: 0.625rem;
    pointer-events: none;

    svg {
      height: 0.875rem;
      width: 0.875rem;
      color: #374151;
    }
  }

  .search-input {
    padding-left: 2rem;
    height: 2.25rem;
    width: 100%;
    border-radius: 0.375rem;
  }
`;
