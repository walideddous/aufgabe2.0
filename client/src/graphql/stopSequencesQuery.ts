import { gql } from "@apollo/client";

export const GET_STOP_SEQUENCE_BY_MODES = gql`
  query RouteManagerItems($modes: [String]!) {
    RouteManagerItems(modes: $modes) {
      _id
      key
      name
      desc
      schedule {
        from
        to
        timeSlices {
          weekDays
          startTime
          endTime
        }
      }
      modes
      stopSequence {
        key
        name
      }
      created
      modified
    }
  }
`;

export const DELETE_STOP_SEQUENCE_BY_MODES = gql`
  mutation RouteManagerDelete($_id: String!) {
    RouteManagerDelete(_id: $_id)
  }
`;

export const SAVE_STOP_SEQUENCE_BY_MODES = gql`
  mutation RouteManagerAdd($data: EMSManagedRouteInput) {
    RouteManagerAdd(data: $data)
  }
`;
