import { gql } from "@apollo/client";

export const GET_STOP_SEQUENCE_BY_KEY = gql`
  query RouteManagerItemByKey($key: String!) {
    RouteManagerItemByKey(key: $key) {
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
export const GET_STOP_SEQUENCE_BY_NAME = gql`
  query RouteManagerItemsByName($name: String!) {
    RouteManagerItemsByName(name: $name) {
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

export const DELETE_STOP_SEQUENCE = gql`
  mutation RouteManagerDelete($key: String!) {
    RouteManagerDelete(key: $key)
  }
`;

export const SAVE_STOP_SEQUENCE = gql`
  mutation RouteManagerAdd($data: EMSManagedRouteInput) {
    RouteManagerAdd(data: $data)
  }
`;
