/// <reference path="jquery.min-1.11.3.js" />
/// <reference path="bootstrap/js/bootstrap.min.js" />
/// <reference path="jquery.dataTables-1.10.11.min.js" />

var vCurrentScrollState = null;

var
Common_Enum = {
    Alert: {
        Warning: 0,
        Error: 1,
        Info: 2,
        Success: 3
    },
    Loader: {
        Show: 0,
        Close: 1
    },
    ControlType: {
        TextBox: 0,
        CheckBox: 1,
        DropDownList: 2
    },
    ParseTo: {
        Int: 0,
        Float: 1,
        JSON: 2
    },
    AuthMsgType: {
        Save: 0,
        Update: 1,
        Delete: 2,
        OpenInEditMode: 3,
        ListView: 4,
        InitData: 5
    }
},
Common_FS = {
    ScrollTo: function (scrollToHeight) {
        $("html, body").animate({ scrollTop: scrollToHeight });
    },
    ApplyDefaultImage: function (oImg) {
        if (oImg.src != defaultCourseImage) {
            oImg.src = defaultCourseImage;
        }
    },
    IsIEBrowserByVersion: function (version) {
        return ($.browser.msie && parseInt($.browser.version, 10) === version);
    },
    GetVisibleWindowWidth: function () {
        return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0;
    },
    GetVisibleWindowHeight: function () {
        return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
    },
    GetPaddedWidth: function (elem) {
        var width = elem.width();

        var extraWidth = parseInt(elem.css('padding-left'), 10);
        if (!isNaN(extraWidth)) width += extraWidth;
        extraWidth = parseInt(elem.css('padding-right'), 10);
        if (!isNaN(extraWidth)) width += extraWidth;
        extraWidth = parseInt(elem.css('border-left-width'), 10);
        if (!isNaN(extraWidth)) width += extraWidth;
        extraWidth = parseInt(elem.css('border-right-width'), 10);
        if (!isNaN(extraWidth)) width += extraWidth;

        return width;
    },
    GetPaddedHeight: function (elem) {
        var height = elem.height();

        var extraHeight = parseInt(elem.css('padding-top'), 10);
        if (!isNaN(extraHeight)) height += extraHeight;
        extraHeight = parseInt(elem.css('padding-bottom'), 10);
        if (!isNaN(extraHeight)) height += extraHeight;
        extraHeight = parseInt(elem.css('border-top-width'), 10);
        if (!isNaN(extraHeight)) height += extraHeight;
        extraHeight = parseInt(elem.css('border-bottom-width'), 10);
        if (!isNaN(extraHeight)) height += extraHeight;

        return height;
    },
    GetElementHeightUsingChildrenHeights: function (elem) {
        var height = 0;
        var childElems = elem.children();

        for (var i = 0; i < childElems.length; i++) {
            var currElem = $(childElems[i]);
            height += Common_FS.GetPaddedHeight(currElem);

            var extraHeight = parseInt(currElem.css('margin-top'), 10);
            if (!isNaN(extraHeight)) height += extraHeight;
            extraHeight = parseInt(currElem.css('margin-bottom'), 10);
            if (!isNaN(extraHeight)) height += extraHeight;
        }

        return height;
    },
    GetTruncatedString: function (inputString, reqLength, stringToBeFollowed) {
        return (inputString.length <= reqLength) ? inputString : inputString.substring(0, reqLength) + stringToBeFollowed;
    },
    GetDateFromJSONData: function (jsonDATE) {
        var d = null;

        if (typeof jsonDATE != 'undefined' && jsonDATE != null && jsonDATE.length >= 13) {
            var s = jsonDATE;
            var parts = s.substr(6, 13);
            var n = parseInt(parts, 10);

            if (!isNaN(n))
                d = new Date(n);
        }

        return d;
    },
    PrintJSONDate: function (JSONDate, DateFormat) {
        DateFormat = (Common_FS.IsNotEmptyORNull(DateFormat) ? DateFormat : "{dd}/{mm}/{yyyy}");
        return Common_FS.GetDateString(Common_FS.GetDateFromJSONData(JSONDate), DateFormat);
    },
    GetDayOfWeekName: function (jsDayOfWeek, fullName) {
        fullName = (typeof fullName != 'undefined' && fullName == true);
        switch (jsDayOfWeek) {
            case 0:
                return (fullName ? "Sunday" : "Sun");
                break;
            case 1:
                return (fullName ? "Monday" : "Mon");
                break;
            case 2:
                return (fullName ? "Tuesday" : "Tue");
                break;
            case 3:
                return (fullName ? "Wednesday" : "Wed");
                break;
            case 4:
                return (fullName ? "Thursday" : "Thu");
                break;
            case 5:
                return (fullName ? "Friday" : "Fri");
                break;
            case 6:
                return (fullName ? "Saturday" : "Sat");
                break;
            default:
                return "";
                break;
        }
    },
    GetMonthName: function (jsDateMonth, fullName) {
        fullName = (typeof fullName != 'undefined' && fullName == true);
        switch (jsDateMonth) {
            case 0:
                return (fullName ? "January" : "Jan");
                break;
            case 1:
                return (fullName ? "February" : "Feb");
                break;
            case 2:
                return (fullName ? "March" : "Mar");
                break;
            case 3:
                return (fullName ? "April" : "Apr");
                break;
            case 4:
                return (fullName ? "May" : "May");
                break;
            case 5:
                return (fullName ? "June" : "Jun");
                break;
            case 6:
                return (fullName ? "July" : "Jul");
                break;
            case 7:
                return (fullName ? "August" : "Aug");
                break;
            case 8:
                return (fullName ? "September" : "Sep");
                break;
            case 9:
                return (fullName ? "October" : "Oct");
                break;
            case 10:
                return (fullName ? "November" : "Nov");
                break;
            case 11:
                return (fullName ? "December" : "Dec");
                break;
            default:
                return "";
                break;
        }
    },
    Convert24HourTo12Hour: function (Hourstime) {
        //This Hourstime should be in 24 hourse format like 18:23:32 or 18:23
        // Check correct time format and split into components
        Hourstime = Hourstime.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [Hourstime];
        if (Hourstime.length > 1) { // If time format correct
            Hourstime = Hourstime.slice(1);  // Remove full string match value
            Hourstime[5] = +Hourstime[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
            Hourstime[0] = +Hourstime[0] % 12 || 12; // Adjust hours
            Hourstime[3] = ((Hourstime[3] != ':00') ? Hourstime[3] : ''); // If seconds are 00 then remove it from Conversion
        } else {
            // If hours and minut combination like this 12:00 then this 00 needs to be handled 
            //( it become single 0 and further calculation messed up so need to replace single 0 with 00) 
            var TempHM = [];
            if (Hourstime[0].indexOf(':0') != -1) {
                TempHM.push(Hourstime[0].replace(':0', ':00'));
                TempHM.push(Hourstime[0].substring(0, (Hourstime[0].indexOf(':'))));
                TempHM.push(':');
                TempHM.push(Hourstime[0].substring((Hourstime[0].indexOf(':') + 1), Hourstime[0].length).replace('0', '00'));
                TempHM.push(undefined);
                TempHM.push(undefined);
            }
            Hourstime = TempHM;
            if (Hourstime.length > 1) { // If time format correct
                Hourstime = Hourstime.slice(1);  // Remove full string match value
                Hourstime[5] = +Hourstime[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
                Hourstime[0] = +Hourstime[0] % 12 || 12; // Adjust hours
                Hourstime[3] = ((Hourstime[3] != ':00') ? Hourstime[3] : ''); // If seconds are 00 then remove it from Conversion
            }
        }
        return Hourstime.join(''); // return adjusted time or original string
    },
    Convert12HourTo24Hour: function (AMPMValue) {// AMPMValue should be string like 06:17 PM
        var hours = Number(AMPMValue.match(/^(\d+)/)[1]);
        var minutes = Number(AMPMValue.match(/:(\d+)/)[1]);
        var AMPM = AMPMValue.match(/\s(.*)$/)[1];
        if (AMPM == "PM" && hours < 12) hours = hours + 12;
        if (AMPM == "AM" && hours == 12) hours = hours - 12;
        var sHours = hours.toString();
        var sMinutes = minutes.toString();
        if (hours < 10) sHours = "0" + sHours;
        if (minutes < 10) sMinutes = "0" + sMinutes;
        return sHours + ":" + sMinutes;
    },
    GetJSONDateForWCFService: function (jsDateObject) {
        //refer: http://stackoverflow.com/questions/4474352/send-jquery-json-to-wcf-rest-using-date
        var dateUTC = new Date(Date.UTC(jsDateObject.getFullYear(), jsDateObject.getMonth(), jsDateObject.getDate(), jsDateObject.getHours(), jsDateObject.getMinutes(), jsDateObject.getSeconds(), jsDateObject.getMilliseconds()));
        var wcfDateStr = '/Date(' + dateUTC.getTime() + ')/';
        return wcfDateStr;
    },
    GetJSONDateForWCFServiceWithoutSeconds: function (jsDateObject) {
        //refer: http://stackoverflow.com/questions/4474352/send-jquery-json-to-wcf-rest-using-date
        var dateUTC = new Date(Date.UTC(jsDateObject.getFullYear(), jsDateObject.getMonth(), jsDateObject.getDate(), jsDateObject.getHours(), jsDateObject.getMinutes()));
        var wcfDateStr = '/Date(' + dateUTC.getTime() + ')/';
        return wcfDateStr;
    },
    GetJSONDateForWCFServiceWithoutTime: function (jsDateObject) {
        //refer: http://stackoverflow.com/questions/4474352/send-jquery-json-to-wcf-rest-using-date
        var dateUTC = new Date(Date.UTC(jsDateObject.getFullYear(), jsDateObject.getMonth(), jsDateObject.getDate()));
        var wcfDateStr = '/Date(' + dateUTC.getTime() + ')/';
        return wcfDateStr;
    },
    ConvertDateToUTC: function (date) {
        if (Common_FS.IsValidJSDateObject(date))
            return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0);
        else
            return date;
    },
    ConvertDateTimeToUTC: function (date) {
        if (Common_FS.IsValidJSDateObject(date))
            return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
        else
            return date;
    },
    convertToJSONDate: function (date) {
        var dt = new Date(date);
        var newDate = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds(), dt.getMilliseconds()));
        return '/Date(' + newDate.getTime() + ')/';
    },
    GetPreviousMonth: function (currentMonth, currentYear) {
        var prev = {
            year: currentYear,
            month: currentMonth - 1
        };
        if (prev.month < 0) {
            prev.month = 11;
            prev.year--;
        }

        return prev;
    },
    GetNextMonth: function (currentMonth, currentYear) {
        var next = {
            year: currentYear,
            month: currentMonth + 1
        };
        if (next.month > 11) {
            next.month = 0;
            next.year++;
        }

        return next;
    },
    IsValidJSDateObject: function (jsDateObject) {
        return (typeof jsDateObject == 'object' && jsDateObject != null && typeof jsDateObject.getDate == 'function');
    },
    GetDateString: function (jsDateObject, dateFormat) {
        if (jsDateObject != null && dateFormat != null) {
            //dateFormat should strictly have "{d}" or "{dd}", "{m}" or 
            //                                "{mm}" or "{mmm}" (for month as short word) or "{mmmm}" (for month as complete word) 
            //                            AND "{yyyy}" or "{yy}" as placeholders for date, month and year
            //examples of dateFormat: "{mm}/{dd}/{yyyy}" OR "{d} {mmm} {yyyy}"
            dateFormat = dateFormat.toLowerCase();

            dateFormat = dateFormat.replace("{dd}", Common_FS.GetZeroPadding(jsDateObject.getDate(), 2))
                                   .replace("{d}", jsDateObject.getDate());

            dateFormat = dateFormat.replace("{mm}", Common_FS.GetZeroPadding(jsDateObject.getMonth() + 1, 2))
                                   .replace("{m}", (jsDateObject.getMonth() + 1))
                                   .replace("{mmm}", Common_FS.GetMonthName(jsDateObject.getMonth(), false))
                                   .replace("{mmmm}", Common_FS.GetMonthName(jsDateObject.getMonth(), true));

            dateFormat = dateFormat.replace("{yyyy}", Common_FS.GetZeroPadding(jsDateObject.getFullYear(), 4));

            dateFormat = dateFormat.replace("{yy}", Common_FS.GetZeroPadding(jsDateObject.getFullYear(), 4).substring(2));

            return dateFormat;
        }
        else {
            return '';
        }
    },
    GetTimeString: function (jsDateObject, dateFormat, isTwentyFourHourNotation) {
        if (jsDateObject != null && dateFormat != null) {
            //dateFormat should strictly have "{h}" or "{hh}", 
            //                                "{mi}" or "{min}", 
            //                                "{s}" or "{ss}" 
            //                            AND "{tt}" (ONLY if isTwentyFourHourNotation is true) as placeholders for hours, minutes, seconds and AM/PM.
            //For minutes "{mi}" will yield string without zeropadding for single digits. "{min}" will yield single digits with zeropadding.
            //examples of dateFormat: "{hh}:{mi}:{ss}" OR "{h}:"
            if (!(typeof isTwentyFourHourNotation != 'undefined' && isTwentyFourHourNotation != null)) isTwentyFourHourNotation = true;

            dateFormat = dateFormat.toLowerCase();

            var hours = jsDateObject.getHours();
            var AMPM = "AM";
            if (isTwentyFourHourNotation == false) {
                if (hours > 11) AMPM = "PM";
                if (hours > 12) hours = hours % 12;
            }

            // Following Condtion updated by sachin to dispy 12 instead of 0 hrs.
            hours = (hours == 0) ? 12 : hours;

            dateFormat = dateFormat.replace("{hh}", Common_FS.GetZeroPadding(hours, 2)).replace("{h}", hours);
            dateFormat = dateFormat.replace("{min}", Common_FS.GetZeroPadding(jsDateObject.getMinutes(), 2)).replace("{mi}", jsDateObject.getMinutes());
            dateFormat = dateFormat.replace("{ss}", Common_FS.GetZeroPadding(jsDateObject.getSeconds(), 2)).replace("{s}", jsDateObject.getSeconds());
            if (isTwentyFourHourNotation == false) {
                dateFormat = dateFormat.replace("{tt}", AMPM);
            }

            return dateFormat;
        }
        else {
            return '';
        }
    },
    GetZeroPadding: function (digitToPad, numberOfDigits) {
        digitToPad = digitToPad + '';
        var difference = numberOfDigits - digitToPad.length;
        for (var i = 0; i < difference; i++) {
            digitToPad = "0" + digitToPad;
        }
        return digitToPad;
    },
    IsDateWithinDateRange: function (dateToCheck, startDate, endDate) {
        var isWithinRange = true;
        if (Common_FS.IsValidJSDateObject(dateToCheck)) {
            if (Common_FS.IsValidJSDateObject(startDate) && (dateToCheck.getTime() < startDate.getTime())) {
                isWithinRange = false;
            }
            if (Common_FS.IsValidJSDateObject(endDate) && (dateToCheck.getTime() > endDate.getTime())) {
                isWithinRange = false;
            }
        }
        else {
            isWithinRange = false;
        }
        return isWithinRange;
    },
    GetDateFromString: function (strdate, strformat) {
        var asdate = strdate.split('/');
        var odate = null;
        switch (strformat) {
            case "d/m/yy":
            case "dd/mm/yyyy":
                odate = new Date(asdate[2], asdate[1] - 1, asdate[0]); break;
            case "m/d/yy":
            case "mm/dd/yyyy":
                odate = new Date(asdate[2], asdate[0] - 1, asdate[1]); break;
            default:
                odate = new Date(asdate[2], asdate[1] - 1, asdate[0]);
                break;
        }
        return odate;
    },
    MaxLengthForTextarea: function (textAreaControl, maxLength) {
        textAreaControl.keypress(function (e) {
            //8 - backspace, 46 - delete, 37 - arrowkeys, 38 - arrowkeys, 39 - arrowkeys, 40 - arrowkeys,
            if (e.which != 8 && e.which != 46 && e.which != 37 && e.which != 38 && e.which != 39 && e.which != 40 && !e.shiftKey && !e.ctrlKey && !e.altKey) {
                return this.value.length < maxLength;
            }
            else {
                return true;
            }
        });
        textAreaControl.blur(function (e) {
            if (this.value.length > maxLength) {
                this.value = this.value.substr(0, maxLength);
            }
        });
    },
    HTMLDecode: function (encodedString) {
        //return stringToModify.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        //encodedString = encodedString.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
        return $("<div/>").html(encodedString).text();
    },
    HTMLEncode: function (stringToModify) {
        return stringToModify.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    },
    StringPlaceholder: function (stringWithFormat, arrayOfParametersToReplace) {
        //If you have string like "From {0} to {1}", and you pass this, along with an array ["Infinity", "Beyond"], 
        //then this function will return "From Infinity to Beyond"
        if (stringWithFormat != null) {
            for (var i = 0; i < arrayOfParametersToReplace.length; i++) {
                if (Common_FS.IsNotEmptyORNull(arrayOfParametersToReplace[i])) {
                    stringWithFormat = stringWithFormat.replace("{" + i + "}", arrayOfParametersToReplace[i]);
                } else {
                    stringWithFormat = stringWithFormat.replace("{" + i + "}", '');
                }
            }
        }
        return stringWithFormat;
    },
    AJAX: function (URL, Parameters, OnSuccess, OnError, Async) {
        $.ajax({
            type: "POST",
            url: URL,
            data: JSON.stringify(Parameters),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: (Common_FS.IsNotEmptyORNull(Async) ? Async : false),
            success: OnSuccess,
            error: OnError
        });
    },
    APICall: function (URL, Parameters, OnSuccess, OnError, Async) {
        $.ajax({
            type: "GET",
            url: URL,
            data: { JSONData: JSON.stringify(Parameters) },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: (Common_FS.IsNotEmptyORNull(Async) ? Async : false),
            success: OnSuccess,
            error: OnError
        });
    },
    SearchFilter: function (obj, key, val) {
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(Common_FS.SearchFilter(obj[i], key, val));
            } else if (i == key && obj[key].toString().toLowerCase().indexOf(val) !== -1) {
                objects.push(obj);
            }
        }
        return objects;
    },

    ///<summary>
    /// description: return true if the value parameter is not null Undefined or Null an empty string (""); otherwise, false.
    ///</summary>
    IsNotEmptyORNull: function (data) {
        if ((typeof data != 'undefined') && (data != null) && (data.length != 0)) {
            return true;
        } else {
            return false;
        }
    },
    IsNull: function (Data) {
        if ((typeof Data !== 'undefined') && (Data != null) && (Data.length != 0)) {
            return Data;
        } else return null;
    },
    MakeDate: function (iDate) {
        if ((typeof iDate !== 'undefined') && (iDate !== null)) {
            var SplitDate = iDate.split('/');
            var month = parseInt(SplitDate[0], 10);
            var date = parseInt(SplitDate[1], 10);
            var year = parseInt(SplitDate[2], 10);

            if (!isNaN(month) && !isNaN(date) && !isNaN(year)) {
                var dateObj = new Date(year, (month - 1), date);
                var dateForService = Common_FS.GetJSONDateForWCFService(dateObj);
                return dateForService;
            } else {
                return null;
            }
        }
    },
    BindDDL: function (ID, Data, ikey, iVal, isDefault_Select, _fnCallBack) {
        if (Common_FS.IsNotEmptyORNull(Data)) {
            var $ID = $('#' + ID);
            if (Common_FS.IsNotEmptyORNull(isDefault_Select) && (isDefault_Select)) {
                $ID.empty().html('<option value="-1" >--Select--</option>');
            }

            $.each(Data, function (i, v) {
                $($ID).append('<option value="' + v[ikey] + '">' + v[iVal] + '</option>');
            });

        } if (Common_FS.IsNotEmptyORNull(_fnCallBack) && _fnCallBack == typeof ('function')) {
            return _fnCallBack();
        }
    },
    BindDynamicDDLBody: function (Data, ikey, iVal, isSelected) {
        var DynamicDDLBody = '<option value="-1">---Select---</option>';
        $.each(Data, function (i, v) {
            DynamicDDLBody += '<option value="' + v[ikey] + '" ' + (Common_FS.IsNotEmptyORNull(isSelected) ? ((isSelected == v[ikey]) ? 'selected="selected"' : '') : '') + '>' + v[iVal] + '</option>';
        });
        return DynamicDDLBody;
    },
    GetValue: function (ID, ParseTo) {
        var Type = $('#' + ID).prop('type');

        switch (Type) {
            case 'text':
                {
                    return (Common_FS.IsNotEmptyORNull(ParseTo) ? Common_FS.ParseTo(ParseTo, $('#' + ID).prop('value')) : $('#' + ID).prop('value'));
                }
                break;
            case 'checkbox':
                {
                    return (Common_FS.IsNotEmptyORNull(ParseTo) ? Common_FS.ParseTo(ParseTo, $('#' + ID).prop('checked')) : $('#' + ID).prop('checked'));
                }
                break;
            case 'select-one':
                {
                    return (Common_FS.IsNotEmptyORNull(ParseTo) ? Common_FS.ParseTo(ParseTo, $('#' + ID).prop('value')) : $('#' + ID).prop('value'));
                }
                break;
            default:
                {
                    return (Common_FS.IsNotEmptyORNull(ParseTo) ? Common_FS.ParseTo(ParseTo, $('#' + ID).prop('value')) : $('#' + ID).prop('value'));
                }
                break;
        }
    },
    GetValueOrNull: function (ID, ParseTo) {
        var Type = $('#' + ID).prop('type');
        switch (Type) {
            case 'text':
                {
                    return Common_FS.IsNull(
                                              Common_FS.IsNotEmptyORNull(ParseTo) ? Common_FS.ParseTo(ParseTo, $('#' + ID).prop('value')) : $('#' + ID).prop('value')
                                            );
                }
                break;
            case 'checkbox':
                {
                    return Common_FS.IsNull(
                                                Common_FS.IsNotEmptyORNull(ParseTo) ? Common_FS.ParseTo(ParseTo, $('#' + ID).prop('checked')) : $('#' + ID).prop('checked')
                                             );
                }
                break;
            case 'select-one':
                {
                    return Common_FS.IsNull(
                                                Common_FS.IsNotEmptyORNull(ParseTo) ? Common_FS.ParseTo(ParseTo, $('#' + ID).prop('value')) : $('#' + ID).prop('value')
                                             );
                }
                break;
            default:
                {
                    return Common_FS.IsNull(
                                                Common_FS.IsNotEmptyORNull(ParseTo) ? Common_FS.ParseTo(ParseTo, $('#' + ID).prop('value')) : $('#' + ID).prop('value')
                                             );
                }
                break;
        }
    },
    SetValue: function (ID, Value) {
        var Type = $('#' + ID).prop('type');
        switch (Type) {
            case 'text':
                {
                    ((Common_FS.IsNotEmptyORNull(Value)) ? $('#' + ID).prop('value', Value) : $('#' + ID).prop('value', ''));
                }
                break;
            case 'checkbox':
                {
                    ((Common_FS.IsNotEmptyORNull(Value)) ? $('#' + ID).prop('checked', Value) : $('#' + ID).prop('checked', false));
                }
                break;
            case 'select-one':
                {
                    ((Common_FS.IsNotEmptyORNull(Value)) ?
                                                        ((Value != '0') ? $('#' + ID).prop('value', Value) : ($('#' + ID).prop('value', '-1'))) :
                                                        $('#' + ID).prop('value', '-1'));
                }
                break;
            default:
                {
                    ((Common_FS.IsNotEmptyORNull(Value)) ? $('#' + ID).prop('value', Value) : $('#' + ID).prop('value', ''));
                }
                break;
        }
    },
    SetData: function (data) {
        return ((Common_FS.IsNotEmptyORNull(data)) ? data : '');
    },
    MakeDisable: function (ID, Flag) {
        ((Common_FS.IsNotEmptyORNull(Flag)) ? $('#' + ID).prop('disabled', Flag) : $('#' + ID).prop('disabled', false));
    },
    ParseTo: function (ParseInto, Value) {
        switch (ParseInto) {
            case 0:
                {
                    return ((Common_FS.IsNotEmptyORNull(Value)) ? parseInt(Value) : null);
                }
                break;
            case 1:
                {
                    return ((Common_FS.IsNotEmptyORNull(Value)) ? parseFloat(Value) : null);
                }
                break;
            case 2:
                {
                    //return ((Common_FS.IsNotEmptyORNull(Value)) ? parseJSON(Value) : null);
                }
                break;
            default:
                {
                    return ((Common_FS.IsNotEmptyORNull(Value)) ? Value : null);
                }
                break;
        }
    },
    GetInnerTableValue: function (Object, ElementByName, ParseTo, IfIsControl) {
        var Temp = null;
        if (Common_FS.IsNotEmptyORNull(IfIsControl)) {
            switch (IfIsControl) {
                case 0:
                    {
                        Temp = $(Object).find('.FS[name="' + ElementByName + '"]').prop('value');
                    }
                    break;
                case 1:
                    {
                        Temp = $(Object).find('.FS[name="' + ElementByName + '"]').prop('checked');
                    }
                    break;
                case 2:
                    {
                        Temp = $(Object).find('.FS[name="' + ElementByName + '"]').prop('value');
                    }
                    break;
                default:
                    {
                        Temp = $(Object).find('.FS[name="' + ElementByName + '"]').html();
                    }
                    break;
            }
        } else {
            Temp = $(Object).find('.FS[name="' + ElementByName + '"]').html();
        }

        if (Common_FS.IsNotEmptyORNull(Temp)) {
            return ((Common_FS.IsNotEmptyORNull(ParseTo)) ? Common_FS.ParseTo(ParseTo, Temp) : Temp);
        } else {
            return null;
        }
    },
    SetInnerTableValue: function (Object, ElementByName, Value, ParseTo, IfIsControl) {
        var Temp = null;
        if (Common_FS.IsNotEmptyORNull(IfIsControl)) {
            switch (IfIsControl) {
                case 0:
                    {
                        Temp = $(Object).find('.FS[name="' + ElementByName + '"]').prop('value', Value);
                    }
                    break;
                case 1:
                    {
                        Temp = $(Object).find('.FS[name="' + ElementByName + '"]').prop('checked', Value);
                    }
                    break;
                case 2:
                    {
                        Temp = $(Object).find('.FS[name="' + ElementByName + '"]').prop('value', Value);
                    }
                    break;
                default:
                    {
                        Temp = $(Object).find('.FS[name="' + ElementByName + '"]').html(Value);
                    }
                    break;
            }
        } else {
            Temp = $(Object).find('.FS[name="' + ElementByName + '"]').html(Value);
        }
    },
    CommonBehaviourOnCRUD: function (e) {
        e.preventDefault();
        $('body,html').scrollTop(0);
        Common_BootStrap.CommonLoader(Common_Enum.Loader.Show);
    },
    AuthMessage: function (Type) {
        var Msg = '';
        switch (Type) {
            case 0: { Msg += 'You are not Authorized person to Save this Data!, Please Contact Administrator to resolve this Issue..'; } break;
            case 1: { Msg += 'You are not Authorized person to Update this Data!, Please Contact Administrator to resolve this Issue..'; } break;
            case 2: { Msg += 'You are not Authorized person to Delete this Data!, Please Contact Administrator to resolve this Issue..'; } break;
            case 3: { Msg += 'You are not Authorized person to Edit this Data!, Please Contact Administrator to resolve this Issue..'; } break;
            case 4: { Msg += 'You are not Authorized person to View Data List!, Please Contact Administrator to resolve this Issue..'; } break;
            case 5: { Msg += 'You are not Authorized person to View Drop Down List Data!, Please Contact Administrator to resolve this Issue..'; } break;
            default: { Msg += 'You are not Authorized person to do this Action!, Please Contact Administrator to resolve this Issue..'; } break;
        }
        return Msg;
    },
    Authentication: function (oData) {
        var oAuth = {
            IsAllowSave: (Common_FS.IsNotEmptyORNull(oData.IsAllowSave) ? ((oData.IsAllowSave) == 'True' ? true : false) : false),
            IsAllowUpdate: (Common_FS.IsNotEmptyORNull(oData.IsAllowUpdate) ? ((oData.IsAllowUpdate) == 'True' ? true : false) : false),
            IsAllowDelete: (Common_FS.IsNotEmptyORNull(oData.IsAllowDelete) ? ((oData.IsAllowDelete) == 'True' ? true : false) : false),
            IsAllowView: (Common_FS.IsNotEmptyORNull(oData.IsAllowView) ? ((oData.IsAllowView) == 'True' ? true : false) : false)
        };
        return oAuth;
    },
    ///<summary>
    /// descripton: means all label and ancher tag in html will localize with text and tool tip reapactively.
    ///</summary>
    fnPageLocalization: function (data) {
        var str = "";
        try {
            $.each(data, function (idx, item) {
                try {  //logic find DisplayControlId and replace text if LanguageText is not empty  and tool tip
                    switch (item.DisplayControlType) {
                        case "Label":
                            $('#' + item.DisplayControlId).text((item.LanguageText != null && item.LanguageText != "") ? item.LanguageText : $('#' + item.DisplayControlId).text());
                            if (item.IsDeleted) $('#' + item.DisplayControlId).parent().hide();
                            break;
                        case "Ancher":
                            $('#' + item.DisplayControlId).text((item.LanguageToolTip != null && item.LanguageToolTip != "") ? item.LanguageToolTip : $('#' + item.DisplayControlId).text());
                            break;
                        case "Tab": if (item.IsDeleted) $('#' + item.DisplayControlId).hide();
                            break;
                        case "TabContainer": if (item.IsDeleted) $('#' + item.DisplayControlId).hide();
                            break;
                    }
                } catch (err_ech_data_item) { }
            });
        } catch (err_ech) { }
    },
    ///<summary>
    /// descripton: add messages "msg" in to passed control "msgCtrl" in the formate of '<li>msg</li>'.
    ///</summary> 
    AppendMsg: function (msgCtrl, msg, alertype) {
        var alertcss = "";
        if (Common_FS.IsNotEmptyORNull(alertype)) {
            switch (alertype) {
                case Common_Enum.Alert.Success:
                    alertcss = "alert alert-success"; break;
                case Common_Enum.Alert.Info:
                    alertcss = "alert alert-info"; break;
                case Common_Enum.Alert.Warning:
                    alertcss = "alert alert-warning"; break;
                case Common_Enum.Alert.Error:
                    alertcss = "alert alert-danger"; break;
            }
        }
        var t = $('<li></li>').addClass(alertcss).text(msg);
        msgCtrl.empty().append(t);
    },
    UpdateMsg: function (msgCtrl, msg, alertype) {
        var alertcss = "";
        if (Common_FS.IsNotEmptyORNull(alertype)) {
            switch (alertype) {
                case Common_Enum.Alert.Success:
                    alertcss = "alert alert-success"; break;
                case Common_Enum.Alert.Info:
                    alertcss = "alert alert-info"; break;
                case Common_Enum.Alert.Warning:
                    alertcss = "alert alert-warning"; break;
                case Common_Enum.Alert.Error:
                    alertcss = "alert alert-danger"; break;
            }
        }
        var t = $('<li></li>').addClass(alertcss).text(msg);
        msgCtrl.empty().append(t);
    },
    ///<summary>
    /// descripton: To get url query string now it will return in JSON format 
    /// e.g var qs=Common_FS.URLQueryString();
    /// to get parameter var p1=qs['id'];\\its case sensitive
    /// to check parameter is present or not . e.g. alert ('id' in qs);// if present then true alese false 
    ///</summary> 
    URLQueryString: function () {
        var url = location.href;
        var qs = url.substring(url.indexOf('?') + 1).split('&');
        for (var i = 0, result = {}; i < qs.length; i++) {
            qs[i] = qs[i].split('=');
            result[qs[i][0]] = decodeURIComponent(qs[i][1]);
        }
        return result;
    },
    ///<summary>
    /// Description : suppose you have JSON data ( like table record) and you want to filtter some unique value 
    ///         where "Value" parameter is column name (field name) for that you want to indentify unique record (e.g. "id" field)
    ///                "Display" parameter is column name (field name) is use for to get column result with respact to "Value" (field name)
    ///                "CodeColumn"  parameter is column name (field name) is optional to get column result with respact 
    ///                 to "Value" (field name) and  "CodeColumn" result is associate with "Dispaly" (field name) (e.g. India-[IN])
    ///</summary>
    FilterJSONDataUniqueItems: function (JSONData, Value, Display, CodeColumn) {
        var result = {}; // temporary  array
        var ActualResult = []; // create the array 
        // Store each of the elements in an object keyed of of the name field. If there is a collision (the name already exists) then it is just replaced with the most recent one
        if (CodeColumn != undefined && CodeColumn != null) {
            for (var i = 0; i < JSONData.length; i++) {
                result[JSONData[i][Value]] = { "Value": JSONData[i][Value], "Display": JSONData[i][Display] + " - [" + JSONData[i][CodeColumn] + "]" };
            }
        }
        else {
            // Store each of the elements in an object keyed of of the name field. If there is a collision (the name already exists) then it is just replaced with the most recent one
            for (var i = 0; i < JSONData.length; i++) {
                result[JSONData[i][Value]] = { "Value": JSONData[i][Value], "Display": JSONData[i][Display] };
            }
        }
        // Push each of the values back into the array.
        for (var item in result) { ActualResult.push(result[item]); }
        return ActualResult;
    },
    IsEmail: function (email) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    },
    ///<summary>
    /// Created by: Satish A.W
    /// descripton: for callback functionality (Check if passing callback function is not null,underfined and funtion type)
    ///</summary> 
    IsCallBack: function (fnCallBack) {
        if ((fnCallBack != undefined && fnCallBack != null) && $.isFunction(fnCallBack)) {
            console.log('Callback Fired');
            return fnCallBack.call();
        } else {
            console.log('No Callback');
        }
    },
    ValidateCommaSeparatedValues: function (_val) {
        var CommaSplit = _val.replace(/\s/g, '').split(','),
            FinalValArray = [];
        for (var i = 0; i < CommaSplit.length; i++) {
            if (Common_FS.IsNotEmptyORNull(CommaSplit[i])) {
                FinalValArray.push(CommaSplit[i]);
            }
        }
        return FinalValArray.join(',');
    }
},
Common_Validation_FS = {//function name should follow java script function camel case
    isTextBoxReq: function (ctrl, msg, msgCtrl) {
        if ($.trim(ctrl.val()).length < 1) {
            ctrl.closest('.form-group').removeClass('has-error').addClass('has-error');
            ctrl.focus();
            Common_FS.AppendMsg(msgCtrl, msg,Common_Enum.Alert.Error);
            return false;
        } else return true;
    }, //to check textbox input length
    isTextBoxReqLen: function (ctrl, min, max, msg, msgCtrl) {
        if ($.trim(ctrl.val()).length < min || $.trim(ctrl.val()).length > max) {
            ctrl.closest('.form-group').removeClass('has-error').addClass('has-error'); ctrl.focus();
            Common_FS.AppendMsg(msgCtrl, msg, Common_Enum.Alert.Error);
            return false;
        } else return true;
    },
    isTextBoxCompare: function (sourcectrl,targetctrl, min, max, msg, msgCtrl) {
        if ($.trim(sourcectrl.val()) != $.trim(targetctrl.val())) {
            sourcectrl.closest('.form-group').removeClass('has-error').addClass('has-error'); 
            targetctrl.closest('.form-group').removeClass('has-error').addClass('has-error'); targetctrl.focus();
            Common_FS.AppendMsg(msgCtrl, msg, Common_Enum.Alert.Error);
            return false;
        } else return true;
    },
    isDropDownReq: function (ctrl, notAcceptVal, msg, msgCtrl) {

        if (notAcceptVal != undefined || notAcceptVal != null)
            if (ctrl.val() == notAcceptVal) { Common_FS.AppendMsg(msgCtrl, msg, Common_Enum.Alert.Error); return false; }
        if (ctrl.val() == "0") {
            ctrl.closest('.form-group').removeClass('has-error').addClass('has-error'); ctrl.focus(); Common_FS.AppendMsg(msgCtrl, msg, Common_Enum.Alert.Error);
            return false;
        } else return true;
    },
    isRegexp: function (regexp, ctrl, msg, msgCtrl) {
        if (!(regexp.test(ctrl.val()))) {
            ctrl.closest('.form-group').removeClass('has-error').addClass('has-error'); ctrl.focus(); Common_FS.AppendMsg(msgCtrl, msg, Common_Enum.Alert.Error);
            return false;
        } else return true;
    },
    ///<summary>
    ///Description: check dropdown like validation on combination (textbox hidden) control where hiddn control value  should not zero (0)
    ///</summary>
    isDropdownTextboxHidden: function (ctrl, hdnctrl, msg, msgCtrl) {
        if (hdnctrl.val() == "0") {
            ctrl.closest('.form-group').removeClass('has-error').addClass('has-error'); ctrl.focus(); Common_FS.AppendMsg(msgCtrl, msg, Common_Enum.Alert.Error);
            return false;
        } else {
            return true;
        }
    },
    ///<summary>
    ///Description: to validate input control value belong to given min max range (min and max also consider)
    ///</summary>
    isNumberInRange: function (ctrl, min, max, msg, msgCtrl) {
        if (Number(ctrl.val()) > max || Number(ctrl.val()) < min) {
            ctrl.closest('.form-group').removeClass('has-error').addClass('has-error'); ctrl.focus(); Common_FS.AppendMsg(msgCtrl, msg, Common_Enum.Alert.Error);
            return false;
        } else return true;
    },
    ///<summary>
    /// use to validate URL
    ///</summary>
    isURL: function (ctrl, msg, msgCtrl) {
        var urlregex = /^((http|https):\/{2})?([w]{3}\.)?(([a-z0-9-])+\.{1})+([a-z0-9])+((\/{1}[a-z0-9-]+)+)?(\?(\w+=\w+(?:&\w+=\w+)*))?$/i;
        if (!urlregex.test(ctrl.val())) {
            ctrl.closest('.form-group').removeClass('has-error').addClass('has-error'); ctrl.focus(); Common_FS.AppendMsg(msgCtrl, msg, Common_Enum.Alert.Error);
            return false;
        } else return true;
    }
},
Common_BootStrap = {
    Modal: function (ID, Header, AppendTo, Toolbox) {
        if ($('#' + ID).length == 0) {
            var Modal = '<!-- Modal -->' +
                        '<div class="modal fade iLightBox" id="' + ID + '" tabindex="-1" role="dialog" aria-labelledby="' + ID + 'Label" aria-hidden="true">' +
                            '<div class="modal-dialog">' +
                                '<div class="modal-content">' +
                                    '<div class="modal-header">' +
                                        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                                        '<h4 class="modal-title" id="' + ID + '_ModalHeader">' + Header + '</h4>' +
                                    '</div>' +
                                    '<div class="modal-body">' +
                                        '<div id="' + ID + '_BodyContent"></div>' +
                                    '</div>' +
                                    '<div class="modal-footer">' +
                                        (((Toolbox != null) && (typeof Toolbox != 'undefined') && (Toolbox)) ?
                                        '<div class="L_Align">' +

                                            '<ul class="pager">' +
                                              '<li><a href="#" id="' + ID + '_PrevItem">Prev</a></li>' +
                                              '<li><a href="#" id="' + ID + '_NextItem">Next</a></li>' +
                                            '</ul>' +

                                        '</div>' +
                                        '<div class="R_Align">' +
                                        '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                                        '<button type="button" class="btn btn-primary">Save changes</button>' +
                                        '</div>'
                                        : '')
            '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<!-- Modal -->';
            (((AppendTo != null) && (AppendTo != 'body')) ? $('#' + AppendTo).append(Modal) : $('body').append(Modal));
        }
    },
    Grid: function (ID, Header) {
        var Grid = '<div class="widget widget-table">' +
                    '<div class="widget-header">' +
                        '<h3><i class="icon-th-list"></i><label id="lblDataTableHeader">&nbsp;' + Header + '</label></h3>' +
        //'<div class="iAddNew ToolTip" data-toggle="tooltip" data-placement="top" title="Add New"><i class="icon-plus"></i></div>' +
        //'<div id="divDataTableRefresh" class="iRefresh ToolTip" data-toggle="tooltip" data-placement="top" title="Refresh"><i class="icon-refresh"></i></div>' +
                    '</div>' +
                    '<!-- /widget-header -->' +
                    '<div class="widget-content WraperCont">' +
                        '<table class="table table-striped table-bordered table-highlight display" id="' + ID + '"></table>' +
                    '</div>' +
                    '<!-- /widget-content -->' +
                '</div>' +
                '<!-- /widget -->' +
            '</div>';
        return Grid;
    },
    Control: function (ID, Header) {
        var Control = '<div class="control-group">' +
                                '<label class="control-label" for="' + ID + '">' + Header + ' :</label>' +
                                '<div class="controls">' +
                                  '<input type="text" id="' + ID + '" class="form-control input-sm" placeholder="' + ID + '" value="" />' +
                                '</div>' +
                      '</div>';
        return Control;
    },
    SymbolControl: function (ID, Header, Type) {
        var SymControl = '<div class="control-group">' +
                            '<label class="control-label" for="' + ID + '">' + Header + ' :</label>' +
                            '<div class="controls">' +
                                '<div class="input-prepend">' +
                                    '<span class="add-on">' +
                                        '<i class="icon-' + Type + '"></i>' +
                                    '</span>' +
                                    '<input class="span2" id="inputIcon" type="text" placeholder="' + ID + '" value="" />' +
                                '</div>' +
                            '</div>' +
                        '</div>';
        return SymControl;
    },
    ControlList: function (IDs, Validate) {
        var ControlsDetails = (Validate) ? Common_BootStrap.GetControlStucture(IDs[0]) : IDs,
            ControlList = '<div class="control-group"><form class="form-horizontal">';
        //console.log(ControlsDetails);
        $.each(ControlsDetails, function (index, value) {
            ControlList += '<div class="control-group">' +
                                    '<label class="control-label" for="' + value.ID + '">' + value.Label + ' :</label>' +
                                    '<div class="controls">' +
                                        '<input type="text" id="' + value.ID + '" class="form-control input-sm" placeholder="' + value.Label + '" value="' + (value.Val != null ? value.Val : '') + '" />' +
                                    '</div>' +
                            '</div>';
        });
        return ControlList + '</form></div>';
    },
    SymbolControlList: function (IDs, Validate) {
        var ControlsDetails = (Validate) ? Common_BootStrap.GetControlStucture(IDs[0]) : IDs,
            SymbolControlList = '';
        $.each(ControlsDetails, function (index, value) {
            SymbolControlList += '<div class="control-group">' +
                                        '<label class="control-label" for="' + value.ID + '">' + value.Label + ' :</label>' +
                                        '<div class="controls">' +
                                            '<div class="input-prepend">' +
                                                '<span class="add-on">' +
                                                    '<i class="icon-calendar ' + value.Type + '"></i>' +
                                                '</span>' +
                                                '<input class="span2" id="inputIcon" type="text" placeholder="' + value.Label + '" value="' + (value.Val != null ? value.Val : '') + '" />' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>';
        });
        return SymbolControlList;
    },
    HorizontalForm: function (ID) {
        return '<div class="control-group"><form class="form-horizontal"></form></div>';
    },
    Alert: function (ID, Type, Message, Close) {
        var Alert = '';
        switch (Type) {
            case 0:
                {
                    Alert = '<div class="alert alert-block alert-warning" id="' + ID + '">' +
                                ((Close != null && Close) ? '<button type="button" class="close" data-dismiss="alert">&times;</button>' : '') +
                                '<strong class="fRgh"><i class="icon icon-warning-sign" ></i></strong> ' + Message +
                             '</div>';
                    break;
                }
            case 1:
                {
                    Alert = '<div class="alert alert-error alert-danger" id="' + ID + '">' +
                                ((Close != null && Close) ? '<button type="button" class="close" data-dismiss="alert">&times;</button>' : '') +
                                '<strong class="fRgh"><i class="icon icon-ban-circle"></i></strong> ' + Message +
                            '</div>';
                    break;
                }
            case 2:
                {
                    Alert = '<div class="alert alert-info" id="' + ID + '">' +
                                ((Close != null && Close) ? '<button type="button" class="close" data-dismiss="alert">&times;</button>' : '') +
                                '<strong class="fRgh"><i class="icon icon-info-sign"  ></i></strong> ' + Message +
                            '</div>';
                    break;
                }
            case 3:
                {
                    Alert = '<div class="alert alert-success" id="' + ID + '">' +
                                ((Close != null && Close) ? '<button type="button" class="close" data-dismiss="alert">&times;</button>' : '') +
                                '<strong class="fRgh"><i class="icon icon-thumbs-up"  ></i></strong> ' + Message +
                            '</div>';
                    break;
                }
            default:
                {
                    Alert = '<div class="alert alert-block alert-warning" id="' + ID + '">' +
                                ((Close != null && Close) ? '<button type="button" class="close" data-dismiss="alert">&times;</button>' : '') +
                                '<strong class="fRgh"><i class="icon icon-question-sign"  ></i></strong>' + Message +
                             '</div>';
                    break;
                }
        }
        return Alert;
    },
    DarkAlert: function (ID, Type, Message, Close) {
        var Alert = '';
        switch (Type) {
            case 0:
                {
                    Alert = '<div class="alert btn-warning" id="' + ID + '">' +
                                ((Close != null && Close) ? '<button type="button" class="close" data-dismiss="alert">&times;</button>' : '') +
                                '<strong class="fRgh"><i class="icon icon-warning-sign" ></i></strong> ' + Message +
                             '</div>';
                    break;
                }
            case 1:
                {
                    Alert = '<div class="alert btn-danger" id="' + ID + '">' +
                                ((Close != null && Close) ? '<button type="button" class="close" data-dismiss="alert">&times;</button>' : '') +
                                '<strong class="fRgh"><i class="icon icon-ban-circle"></i></strong> ' + Message +
                            '</div>';
                    break;
                }
            case 2:
                {
                    Alert = '<div class="alert btn-info" id="' + ID + '">' +
                                ((Close != null && Close) ? '<button type="button" class="close" data-dismiss="alert">&times;</button>' : '') +
                                '<strong class="fRgh"><i class="icon icon-info-sign"  ></i></strong> ' + Message +
                            '</div>';
                    break;
                }
            case 3:
                {
                    Alert = '<div class="alert btn-success" id="' + ID + '">' +
                                ((Close != null && Close) ? '<button type="button" class="close" data-dismiss="alert">&times;</button>' : '') +
                                '<strong class="fRgh"><i class="icon icon-thumbs-up"  ></i></strong> ' + Message +
                            '</div>';
                    break;
                }
            default:
                {
                    Alert = '<div class="alert btn-warning" id="' + ID + '">' +
                                ((Close != null && Close) ? '<button type="button" class="close" data-dismiss="alert">&times;</button>' : '') +
                                '<strong class="fRgh"><i class="icon icon-question-sign"  ></i></strong>' + Message +
                             '</div>';
                    break;
                }
        }
        return Alert;
    },
    SetModalContent_N_Display: function (ID, BodyContent, Toolbox, Header) {
        var Head = (Common_FS.IsNotEmptyORNull(Header) ? Header : 'Information');
        //console.log(Head);
        if ($('#' + ID).length === 0) {
            Common_BootStrap.Modal(ID, Head, null, Toolbox);
            $('#' + ID + '_BodyContent').empty().html(BodyContent);
            $('#' + ID).modal('show');
        } else {
            $('#myModalLabel').empty().html(Head);
            $('#' + ID + '_BodyContent').empty().html(BodyContent);
            $('#' + ID).modal('show');
        }
    },
    CommonRequestError: function (request) {//added by surendra it take care about ajax call error
        Common_BootStrap.CommonLoader(Common_Enum.Loader.Close);
        var Message = Common_BootStrap.Alert('CommonForAll', Common_Enum.Alert.Error, ("<strong>Status</strong>:" + request.status + "</br><strong>Error</strong>:" + request.statusText + "</br><strong>Request</strong>:" + request.responseText + "<br><strong>Ready State</strong>:" + request.readyState));
        Common_BootStrap.SetModalContent_N_Display('CommonModal', Message, false, "Error");
        return false;
    },
    CommonError: function (request, status, error) {
        if ((typeof JQUICommon.LoadingOff != 'undefined') && (JQUICommon.LoadingOff != null) && (typeof JQUICommon.LoadingOff == "function")) { JQUICommon.LoadingOff(); }
        Common_BootStrap.CommonLoader(Common_Enum.Loader.Close);
        var Message = Common_BootStrap.Alert('CommonForAll', Common_Enum.Alert.Error, ("</br><strong>Error</strong>:" + error + "</br><strong>Request</strong>:" + (JSON.stringify(request)) + "<br><strong>Status</strong>:" + status));
        Common_BootStrap.SetModalContent_N_Display('CommonModal', Message, false);
        return false;
    },
    GetControlStucture: function (data) {
        var ControlStucture = [];
        $.each(data, function (index, value) {
            ControlStucture.push({ ID: index, Label: index.toUpperCase(), Val: value });
        });
        return ControlStucture;
    },
    CommonLoader: function (Func, Inline) {
        if (($('#loaderOverlay').length === 0) && ($('#commonMasterLoader').length === 0)) {
            var WhereToPut = (Common_FS.IsNotEmptyORNull(Inline) ? Inline : 'body'),
                LoaderHTML = '<div class="lxoverlay lxtransparent" id="loaderOverlay"></div>' +
					         '<div id="commonMasterLoader" class="lxloader-centered-common">' +
						        '<div id="uploadProcess">' +
							        '<div id="uploadProgressTxt">' +
                                        'Processing...' +
                                    '</div>' +
							        '<div class="SettingImg" >' +
                                        '<span class="glyphicon glyphicon-refresh glyphicon-animate"></span>' +
                                    '</div>' +
							        '<div id="uploadProgressOutline">' +
								        '<div id="uploadProgress"></div>' +
							        '</div>' +
						        '</div>' +
					        '</div>';

            $(WhereToPut).append(LoaderHTML);
        }
        var iLoader = {
            LoaderOverlay: $("#loaderOverlay"),
            Loader: $("#commonMasterLoader"),
            Close: function () {
                $(window).scrollTop(vCurrentScrollState);
                vCurrentScrollState = null;
                iLoader.Loader.hide();
                iLoader.LoaderOverlay.hide();
            },
            Show: function () {
                vCurrentScrollState = $(window).scrollTop();
                $(window).scrollTop(0);
                iLoader.Loader.show();
                iLoader.LoaderOverlay.css('width', '100%').show();
                iLoader.SelfAdjust();
            },
            SelfAdjust: function () {
                iLoader.LoaderOverlay.css({ 'width': '100%', 'height': '100%' });
                iLoader.Loader.css('height', '100%');
            }
        }
        switch (Func) {
            case 0:
                {
                    iLoader.Show();
                } break;
            case 1:
                {
                    iLoader.Close();
                    if (WhereToPut != 'body') { iLoader.LoaderOverlay.remove(); iLoader.Loader.remove(); }
                } break;
        }
    },
    iNotification: function (Msg) {
        if ($('#AlertOverlay').length === 0) {
            $('body').append('<div class="lxoverlay lxtransparent" id="AlertOverlay" style="width: ' + $('body').width() + 'px !important;height: ' + $('body').height() + 'px !important;"></div>');
            $('#AlertOverlay').show();
            $('body,html').scrollTop(0);
        } else {
            $('#AlertOverlay').show().css({ width: $('body').width() + 'px !important', height: $('body').height() + 'px !important' });
            $('body,html').scrollTop(0);
        }

        if ($('.Notification_Mgr').length === 0) {
            //console.log('ala');
            var Notification = '<div class="well Notification_Mgr " >' + Msg + '</div>';
            $('body').append(Notification);
            $('.Notification_Mgr').empty().html(Msg).show().fadeOut(5000, function () {
                $(this).empty();
                $('#AlertOverlay').hide();
            });
        } else {
            $('.Notification_Mgr').empty().html(Msg).show().fadeOut(5000, function () {
                $(this).empty();
                $('#AlertOverlay').hide();
            });
        }
    },
    Notifier: function (Msg, Duration) {

        if ($('#AlertOverlay').length === 0) {
            $('body').append('<div class="lxoverlay lxtransparent" id="AlertOverlay" style="width: ' + $('body').width() + 'px !important;height: ' + $('body').height() + 'px !important;"></div>');
            $('#AlertOverlay').show();
            $('body,html').scrollTop(0);
        } else {
            $('#AlertOverlay').show().css({ width: $('body').width() + 'px !important', height: $('body').height() + 'px !important' });
            $('body,html').scrollTop(0);
        }

        if ($('.Notification_Mgr').hasClass('iNotifier_Open')) {
            var Delay = (Common_FS.IsNotEmptyORNull(Duration) ? Duration : 1500)
            setTimeout(function () {
                Common_BootStrap.Notifier(Msg, Delay);
            }, (Delay + 500));
        } else {
            var Notifier_MSG = {
                Element: $('.Notification_Mgr'),
                DisplayDurarion: 2000,
                FadeDuration: (Common_FS.IsNotEmptyORNull(Duration) ? Duration : 1500),
                Timer: null
            }
            if (Notifier_MSG.Element.length === 0) {
                var Notification = '<div class="Notification_Mgr iNotifier_Close" ></div>';
                $('body').append(Notification);
                //console.log('if');
                Common_BootStrap.Notifier(Msg, Notifier_MSG.FadeDuration);
            } else {
                //console.log('els');
                Notifier_MSG.Element.empty().html(Msg);
                var leftPosition = $('body').offset().left + Math.floor($('body').width() / 2) - Math.floor(Notifier_MSG.Element.width() / 2);
                if (leftPosition > 25) {
                    leftPosition = leftPosition - 25; //(-25 for leftpadding)
                }
                Notifier_MSG.Element.css('left', leftPosition + 'px');

                Notifier_MSG.Element.fadeIn(Notifier_MSG.FadeDuration, function () {
                    Notifier_MSG.Element.addClass('iNotifier_Open').removeClass('iNotifier_Close');
                    if (Notifier_MSG.Timer != null) { clearTimeout(Notifier_MSG.Timer); $('#AlertOverlay').hide(); }
                    Notifier_MSG.Timer = setTimeout(function () {
                        Notifier_MSG.Element.fadeOut(Notifier_MSG.FadeDuration, function () {
                            Notifier_MSG.Element.addClass('iNotifier_Close').removeClass('iNotifier_Open');
                            $('#AlertOverlay').hide();
                        });
                        Notifier_MSG.Timer = null;
                    }, Notifier_MSG.DisplayDurarion);
                });
            }
        }
    },
    PropoverData: function (RowData, ID) {
        var Table = $('#' + ID).dataTable(),
            aData = {}; aData = Table.fnGetData(RowData),
            DynamicPropOverBody = '';

        $.each(aData, function (i, v) {
            (Common_FS.IsNotEmptyORNull(v) ? (DynamicPropOverBody += i + ': ' + v + '<br />') : ('<br />'));
        });
        return DynamicPropOverBody;
    }
},
Common_DataTable = {
    iDatatables: function (ID, iData, iColumStruct, SelectByIDColum, iTargetColum) {
        var Table = $('#' + ID).DataTable({
            "dom": "<'row'<'fLft'i><'fRgh_Top'f>r>t<'row'<'fLft'l><'fRgh'p>>",
            "pagingType": "bootstrap",
            "language": {
                "lengthMenu": "_MENU_ <label id='lblRecordsPerPage'>records per page</label>",
                "decimal": ",",
                "thousands": ".",
                "zeroRecords": "<label id='lblZeroRecordsFound'>Nothing found - sorry</label>",
                "info": "<label id='lblShowingPageOf'>Showing page _PAGE_ of _PAGES_ ( Total Records : _TOTAL_ )</label>",
                "infoEmpty": "<label id='lblNoRecordFoundInGlobalSearch'>No records available</label>",
                "infoFiltered": "<label id='lblFilteredFromTotalRecords'>( filtered from _MAX_ total records )</label>",
                "sSearch": "<label id='lblGlobalSearch'>Global Search</label>"
            },
            "data": iData,
            "dataSrc": "",
            "columns": (((typeof iColumStruct != 'undefined') && (iColumStruct != null)) ? iColumStruct : Common_DataTable.iDataTableColumnStructure(iData[0])),
            "columnDefs": [
               {
                   "targets": ((Common_FS.IsNotEmptyORNull(iTargetColum)) ? iTargetColum : 0),
                   "render": function (data, type, full) {
                       return '<a class="EditByID" href="#" PCode="' + data + '" PID="' + full[SelectByIDColum] + '" data-toggle="popover" >' + data + '</a>';
                   }
               }
            ]
        });
        // Adding Footer 
        $('#' + ID).append('<tfoot><tr></tr></tfoot>');
        var Footer = $('#' + ID + ' tfoot tr:eq(0)');
        $('#' + ID + ' thead th').each(function () {
            $(Footer).append('<th></th>');
        });
        //$('#' + ID + ' tfoot th:eq(0)').empty();
    },
    iDataTable_With_RowGrouping: function (ID, iData, iColumStruct, ColumPosition) {
        var Table = $('#' + ID).DataTable({
            "dom": "<'row'<'fLft'l><'fRgh_Top'f>r>t<'row'<'fLft'i><'fRgh'p>>",
            "pagingType": "bootstrap",
            "language": {
                "lengthMenu": "_MENU_ records per page",
                "decimal": ",",
                "thousands": "."
            },
            "data": iData,
            "dataSrc": "",
            "columns": (((typeof iColumStruct != 'undefined') && (iColumStruct != null)) ? iColumStruct : Common_BootStrap.iDataTableColumnStructure(iData[0])),
            "columnDefs": [
               {
                   "targets": 0,
                   "render": function (data, type, full) {
                       return '<a class="EditByID" data-toggle="modal" data-target="#myModal" href="' + data + '" ><i class="icon-pencil"></i></a>';
                   }
               },
               {
                   "targets": 4,
                   "render": function (data, type, full) {
                       return '<a class="DeleteByID" data-toggle="modal" data-target="#myModal" href="' + data + '" ><i class="icon-trash"></i></a>';
                   }
               }
            //,{ "visible": false, "targets": parseInt(ColumPosition) } /* If you want to hide Column which is group by */
            ],
            "order": [[parseInt(ColumPosition), 'asc']],
            "drawCallback": function (settings) {
                var api = this.api();
                var rows = api.rows({ page: 'current' }).nodes();
                var last = null;

                api.column(parseInt(ColumPosition), { page: 'current' }).data().each(function (group, i) {
                    if (last !== group) {
                        $(rows).eq(i).before('<tr class="group"><td colspan="5">' + group + '</td></tr>');
                        last = group;
                    }
                });
            }
        });
        // Adding Footer 
        $('#' + ID).append('<tfoot><tr></tr></tfoot>');
        var Footer = $('#' + ID + ' tfoot tr:eq(0)');
        $('#' + ID + ' thead th').each(function () {
            $(Footer).append('<th></th>');
        });

    },
    iDataTableColumnStructure: function (data) {
        var columns = [], ColumWidth = 0;
        $.each(data, function (index, value) {
            ColumWidth = ColumWidth + 1;
        });
        ColumWidth = (100 / ColumWidth);
        $.each(data, function (index, value) {
            columns.push({ 'data': index, 'sTitle': index.toUpperCase(), 'width': ColumWidth + '%' });
        });
        return columns;
    },
    iColumFilter_By_Select: function (ID) {
        var Table = $('#' + ID).DataTable();

        $('#' + ID + ' tfoot th').each(function (i) {
            var title = $('#' + ID + ' thead th').eq($(this).index()).text(),
                select = $('<select><option class="iFilter_Deflt" value="">' + title + '</option></select>')
        	            .appendTo($(this).empty())
        	            .on('change', function () {
        	                Table.column(i).search($(this).val()).draw();
        	            });

            Table.column(i).data().unique().sort().each(function (d, j) {
                select.append('<option value="' + d + '">' + d + '</option>')
            });
        });
    },
    iColumFilter_By_Text: function (ID) {

        var Table = $('#' + ID).DataTable();

        ////Setup - add a text input to each footer cell
        $('#' + ID + ' tfoot th').each(function () {
            var title = $('#' + ID + ' thead th').eq($(this).index()).text();
            $(this).html('<input type="text" placeholder="Search ' + title + '" />');
        });

        // Apply the filter
        $('#' + ID + ' tfoot input').on('keyup', function () {
            Table
            .column($(this).parent().index() + ':visible')
            .search(this.value)
            .draw();
        });
    },
    iCustomColumFilter: function (ID, ColumsCollection) {
        var Table = $('#' + ID).dataTable();
        Table.columnFilter({
            sPlaceHolder: "tfoot",
            aoColumns: [
                null, { "type": "text" }, { "type": "text" }, { "type": "text" }, { "type": "text" }
            ]
        });
    },
    iDataTable_Colum_Reorder: function (ID) {
        var Table = $('#' + ID).DataTable();
        new $.fn.dataTable.ColReorder(Table, { "bRealtime": true });
    },
    iDataTable_Colum_Picker: function (ID) {
        var Table = $('#' + ID).DataTable();
        var colvis = new $.fn.dataTable.ColVis(Table);
        $(colvis.button()).insertAfter($('#' + ID + '_filter'));
    },
    iDataTable_Colum_KeyBoardNavigation: function (ID) {
        var Table = $('#' + ID).DataTable();
        new $.fn.dataTable.KeyTable(Table);
    },
    iDataTable_Export_Toolkit: function (ID) {
        var Table = $('#' + ID).DataTable();
        var tt = new $.fn.dataTable.TableTools(Table);
        $(tt.fnContainer()).insertAfter($('#' + ID + '_filter'));
    },
    iDataTable_Colum_AutoFill: function (ID) {
        var Table = $('#' + ID).DataTable();
        new $.fn.dataTable.AutoFill(Table);
    },
    iDataTable_GetSelectedRowData: function (ID) {
        Table = $('#' + ID).DataTable();

        $('#' + ID + ' tbody tr').on('click', function (event) {
            var Data = Table.fnGetData(this); // get datarow
            if (null != Data)  // null if we clicked on title row
            {
                //now aData[0] - 1st column(count_id), aData[1] -2nd, etc. 
            }
        });
    }
}

/* DefaultEvents which handles Default Behavior's */
$(document).ready(function () {
    $('#pageBody').on('mouseover', '.iProp', function (e) {
        e.preventDefault();
        var $this = $(this),
            Content = ((Common_FS.IsNotEmptyORNull($this.attr('data-content'))) ? $this.attr('data-content') : 'top'),
            Title = ((Common_FS.IsNotEmptyORNull($this.attr('data-header'))) ? $this.attr('data-header') : 'top'),
            placement = ((Common_FS.IsNotEmptyORNull($this.attr('data-placement'))) ? $this.attr('data-placement') : 'top');

        $this.popover({
            title: Title,
            placement: placement,
            content: Content,
            container: 'body',
            html: true
        }).popover("show");

    }).on('mouseout', '.iProp', function (e) {
        e.preventDefault();
        $(this).popover('hide');
    })

    /* Bootstrap Title affect Common Event Handler End */

    //$("#JQUICommonLoading").dialog({
    //    autoOpen: false,
    //    width: 230,
    //    height: 50,
    //    modal: true,
    //    position: {
    //        my: "center",
    //        at: "center",
    //        of: window
    //    },
    //    resizable: false,
    //    stack: true,
    //    open: function (event, ui) {
    //        //console.log(event);
    //        $(event.target.previousSibling).hide();
    //        $(event.target).dialog("option", "position", { my: "center", at: "center", of: window });
    //    }
    //});

});

var JQUICommon = {
    fnLoadingOn: function () {
        //$("#JQUICommonLoading").dialog('open');
    },
    fnLoadingOff: function () {
        // $("#JQUICommonLoading").dialog('close');
    }
}
