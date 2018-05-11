declare module Owls {

    /**
     * Request Interfaces
     */
    export interface OwlUserRequest {
        guid: string;
    }

    export interface OwlAvatarRequest {
        width?: number;
        height?: number;
        s?: boolean;
    }

    export interface OwlvCardRequest {
        s?: boolean;
    }

    export interface OwlListRequest {
        previous_page_uri?: string;
        next_page_uri?: string;
        first_page_uri?: string;
        last_page_uri?: string;
        first_name?: string;
        last_name?: string;
        email?: string;
        phone?: string;
        birthday?: string;
        date_hired?: string;
        hiredAfter?: string;
        formatted?: string;
        parliaments?: Array<string>;
    }

    export interface OwlSearchRequest {
        name?: string;
        email?: string;
        phone?: string;
        formatted?: boolean;
        parliaments?: Array<string>;
    }

    export interface OwlAuthRequest {
        username: string;
        password?: string;
        key?: string;
    }

    /**
     * Response Interfaces
     */

    export interface OwlUserResponse {
        guid: string;
        username: string;
        first_name: string;
        last_name: string;
        display_name: string;
        aliases: Array<string>;
        phone: string;
        twilio_phone: string;
        email: string;
        avatar: string;
        vcard: string;
        role: string;
        department: string;
        location: string;
        birthday: string;
        date_hired: string;
        parliaments: Array<string>;
        date_created: Date;
        date_updated: Date;
        uri: string;

    }

    /**
     * Property Interfaces
     */

    export interface Headers {
        [key: string]: any;
    }

}

declare module '*.json' {
    const value: any;
    export default value;
}
