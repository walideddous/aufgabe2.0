import { gql } from "@apollo/client";

export const GET_STOPS_BY_MODES = gql`
  query PTStopItems($modes: [String]!) {
    PTStopItems(modes: $modes) {
      type
      name
      key
      geojson {
        type
        geometry {
          type
          coordinates
        }
      }
      data
    }
  }
`;
