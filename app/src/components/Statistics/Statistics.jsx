import { FishProDemo } from './FishProDemo';

export const Statistics = (props) => {
  // Delegate to the FishProDemo which contains the full UI
  return <FishProDemo {...props} />;
};