import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import List "mo:core/List";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type BookingId = Nat;
  type BookingStatus = {
    #pending;
    #confirmed;
    #completed;
    #cancelled;
  };

  type BookingDetails = {
    name : Text;
    phone : Text;
    pickup : Text;
    dropoff : Text;
    date : Text;
    time : Text;
    vehicle : Text;
    notes : Text;
  };

  type BookingRecord = {
    id : BookingId;
    details : BookingDetails;
    status : BookingStatus;
    createdAt : Int;
  };

  module BookingRecord {
    public func compareById(record1 : BookingRecord, record2 : BookingRecord) : Order.Order {
      Nat.compare(record1.id, record2.id);
    };
  };

  public type UserProfile = {
    name : Text;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();
  let bookingRecords = Map.empty<BookingId, BookingRecord>();
  var nextBookingId : BookingId = 1;

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return null;
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      return null;
    };
    userProfiles.get(user);
  };

  public query ({ caller }) func getUserIdByName(name : Text) : async ?Principal {
    var iter = userProfiles.entries();
    var entry = iter.next();
    while (entry != null) {
      switch (entry) {
        case (? (principal, profile)) {
          if (Text.equal(profile.name, name)) {
            return ?principal;
          };
        };
        case (null) {};
      };
      entry := iter.next();
    };
    null;
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return;
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func submitBooking(details : BookingDetails) : async BookingId {
    if (
      details.name.isEmpty() or details.phone.isEmpty() or details.pickup.isEmpty() or details.dropoff.isEmpty() or details.vehicle.isEmpty()
    ) {
      return 0;
    };

    let bookingId = nextBookingId;
    nextBookingId += 1;

    let bookingRecord : BookingRecord = {
      id = bookingId;
      details;
      status = #pending;
      createdAt = Time.now();
    };

    bookingRecords.add(bookingId, bookingRecord);
    bookingId;
  };

  public query ({ caller }) func getBookingStatusById(bookingId : BookingId) : async ?BookingStatus {
    switch (bookingRecords.get(bookingId)) {
      case (?record) { ?record.status };
      case (null) { null };
    };
  };

  public query ({ caller }) func getBookingsByPhone(phone : Text) : async [BookingRecord] {
    let filtered = List.empty<BookingRecord>();
    for ((_, booking) in bookingRecords.entries()) {
      if (Text.equal(booking.details.phone, phone)) {
        filtered.add(booking);
      };
    };
    filtered.toArray();
  };

  public query ({ caller }) func getAllBookingsForAdmin() : async [BookingRecord] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return [];
    };
    let sortedArray = bookingRecords.values().toArray().sort(BookingRecord.compareById);
    sortedArray;
  };

  public shared ({ caller }) func updateBookingStatus(bookingId : BookingId, newStatus : BookingStatus) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return false;
    };

    switch (bookingRecords.get(bookingId)) {
      case (?record) {
        let updatedRecord = {
          record with
          status = newStatus;
        };
        bookingRecords.add(bookingId, updatedRecord);
        true;
      };
      case (null) { false };
    };
  };

  public shared ({ caller }) func deleteBooking(bookingId : BookingId) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return false;
    };

    if (not bookingRecords.containsKey(bookingId)) {
      return false;
    };
    bookingRecords.remove(bookingId);
    true;
  };
};
