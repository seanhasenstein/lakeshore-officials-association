import React from 'react';
import styled from 'styled-components';

const initialLevels = [
  { name: 'MS', checked: true },
  { name: 'L5', checked: true },
  { name: 'L4', checked: true },
  { name: 'L3', checked: true },
  { name: 'L2', checked: true },
  { name: 'L1', checked: true },
  { name: 'L0', checked: true },
];

type Levels = { name: string; checked: boolean }[];

export default function Filter() {
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [levels, setLevels] = React.useState<Levels>(initialLevels);

  const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedLevels = levels.map(level => {
      if (level.name === e.target.name) {
        return { ...level, checked: e.target.checked };
      } else {
        return level;
      }
    });

    setLevels(updatedLevels);
  };

  return (
    <FilterStyles ref={menuRef}>
      <h3>Filter by level:</h3>
      <div className="levels">
        {levels.map(level => (
          <div key={level.name} className="level">
            <input
              type="checkbox"
              name={level.name}
              id={level.name}
              value={level.name}
              checked={level.checked}
              onChange={handleClick}
              className="sr-only"
            />
            <label
              htmlFor={level.name}
              className={level.checked ? 'checked' : ''}
            >
              {level.name}
            </label>
          </div>
        ))}
      </div>
    </FilterStyles>
  );
}

const FilterStyles = styled.div`
  h3 {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.075em;
    color: #1f2937;
  }

  .levels {
    margin: 0.75rem 0 0;
    position: relative;
    flex-shrink: 0;
    display: flex;
    border-radius: 0.3125rem;
  }

  .level {
    &:first-of-type label {
      border-top-left-radius: 0.3125rem;
      border-bottom-left-radius: 0.3125rem;
    }

    &:last-of-type label {
      border-top-right-radius: 0.3125rem;
      border-bottom-right-radius: 0.3125rem;
    }
  }

  input[type='checkbox']:focus-visible + label {
    box-shadow: #f1f5f9 0px 0px 0px 2px, #2672e5 0px 0px 0px 4px,
      rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    z-index: 200;
  }

  label {
    position: relative;
    margin: 0 0 0 -1px;
    height: 34px;
    padding: 0 0.875rem;
    display: flex;
    align-items: center;
    background-color: transparent;
    border: 1px solid #d1d5db;
    box-shadow: inset 0 1px 1px transparent;
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
    letter-spacing: 0.0125em;
    cursor: pointer;

    &:hover {
      background-color: rgba(230, 235, 240, 0.5);
    }

    &.checked {
      background-color: #d6e4fa;
      border-color: #b3cdf5;
      color: #134796;
      box-shadow: inset 0 1px 1px #f8fbfe;
      z-index: 100;

      &:hover {
        background-color: #c5d8f8;
      }
    }
  }
`;
