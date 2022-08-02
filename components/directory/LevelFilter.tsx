import React from 'react';
import styled from 'styled-components';
import { FilterLevels } from '../../interfaces';

type Props = {
  levels: FilterLevels;
  setLevels: React.Dispatch<React.SetStateAction<FilterLevels>>;
};

export default function Filter(props: Props) {
  const menuRef = React.useRef<HTMLDivElement>(null);

  const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedLevels = props.levels.map(level => {
      if (level.name === e.target.name) {
        return { ...level, checked: e.target.checked };
      } else {
        return level;
      }
    });

    props.setLevels(updatedLevels);
  };

  return (
    <FilterStyles ref={menuRef}>
      <h3>Filter by level:</h3>
      <div className="levels">
        {props.levels.map(level => (
          <div key={level.name} className="level-item">
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

  .level-item {
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

  @media (max-width: 640px) {
    width: 100%;

    .levels {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    }

    label {
      justify-content: center;
      text-align: center;
    }
  }

  @media (max-width: 375px) {
    label {
      padding: 0 0.625rem;
    }
  }
`;
