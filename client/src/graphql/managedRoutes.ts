import { gql } from "@apollo/client";

export const GET_MANAGED_ROUTE_BY_KEY = gql`
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
export const GET_MANAGED_ROUTE_BY_NAME = gql`
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

export const DELETE_MANAGED_ROUTE = gql`
  mutation RouteManagerDelete($key: String!) {
    RouteManagerDelete(key: $key)
  }
`;

export const SAVE_MANAGED_ROUTE = gql`
  mutation RouteManagerAdd($data: EMSManagedRouteInput) {
    RouteManagerAdd(data: $data)
  }
`;
