/* ===== Đầu: Phần chức năng kiểm tra loại file ===== */
    $('#fileup').change(function(){
    //here we take the file extension and set an array of valid extensions
        var res=$('#fileup').val();
        var arr = res.split("\\");
        var filename=arr.slice(-1)[0];
        filextension=filename.split(".");
        filext="."+filextension.slice(-1)[0];
        valid=[".xls",".xlsx"];
    //if file is not valid we show the error icon, the red alert, and hide the submit button
        if (valid.indexOf(filext.toLowerCase())==-1){
            $( ".imgupload" ).hide("slow");
            $( ".imgupload.ok" ).hide("slow");
            $( ".imgupload.stop" ).show("slow");
          
            $('#namefile').css({"color":"red","font-weight":700});
            $('#namefile').html("File "+filename+" is not  pic!");
            
            $( "#submitbtn" ).hide();
            $( "#fakebtn" ).show();
        }else{
            //if file is valid we show the green alert and show the valid submit
            $( ".imgupload" ).hide("slow");
            $( ".imgupload.stop" ).hide("slow");
            $( ".imgupload.ok" ).show("slow");
          
            $('#namefile').css({"color":"green","font-weight":700});
            $('#namefile').html(filename);
          
            $( "#submitbtn" ).show();
            $( "#fakebtn" ).hide();
        }
    });
/* ===== Cuối: Phần chức năng kiểm tra loại file ===== */



/* ===== Đầu: Phần chức năng đọc file excel ===== */
    var selectedFile;
    document
        .getElementById("fileup")
        .addEventListener("change", function(event) {
            selectedFile = event.target.files[0];
        });
    document
        .getElementById("submitbtn")
        .addEventListener("click", function() {
            if (selectedFile) {
                console.log("hiii");
                var fileReader = new FileReader();
                fileReader.onload = function(event) {
                    var data = event.target.result;

                    var workbook = XLSX.read(data, {
                        type: "binary"
                    });
                    workbook.SheetNames.forEach(sheet => {
                        let rowObject = XLSX.utils.sheet_to_row_object_array(
                            workbook.Sheets[sheet]
                        );
                        let jsonObject = JSON.stringify(rowObject);
                        // document.getElementById("jsonData").innerHTML = jsonObject;
                        
                        // console đoạn json dưới dạng string
                        console.log(jsonObject);

                        // console đoạn json dưới dạng đối tượng
                        console.log(rowObject, typeof(rowObject), rowObject.Name);

                        /*view_json_1(rowObject);*/
                        view_json_employee(rowObject);

                        
                    });
                };
                fileReader.readAsBinaryString(selectedFile);
            }
        });

    /*function view_json_1(rowObject) {
        var abc = document.getElementById("content");
        var count = 0;
        var insert_html = '';

        for (i = 0; i < rowObject.length; i++) {
            if (typeof(rowObject[i]["Name"]) != "undefined") {
                count++;
            }
        }
        console.log(count);
    }*/

    function view_json_employee(rowObject) {

        var obj_check_null = [];
        var obj_group = [];
        var dem = 0;

        for(var x in rowObject) {
            if (rowObject[x]['Name'] && rowObject[x]['Company'] && rowObject[x]['Card No']) {
                console.log(rowObject[x], "hello xxx");
                obj_check_null.push(rowObject[x]);
                dem++;
            }
        }
        console.log(dem, obj_check_null);

        datatable.rows.add(obj_check_null); // Add new data
        datatable.columns.adjust().draw(); // Redraw the DataTable

        /*const arrayUniqueByKey = [...new Map(rowObject.map(item =>
          [item[key], item])).values()];*/

        /*console.log("key nè: ", arrayUniqueByKey);*/

        // var abc = document.getElementById("content"); //Lấy ra id phần hiện thông tin (test)
        var insert_html = '';
        var button_id = 1;

        var groupBy = function(xs, key) {
            return xs.reduce(function(rv, x) {
                (rv[x[key]] = rv[x[key]] || []).push(x);
                return rv;
            }, {});
        };
        var groubedByTeam = groupBy(obj_check_null, 'Company');

        console.log("Phân chia theo mục Company:");
        console.log("");
        console.log(groubedByTeam);
        console.log(typeof(groubedByTeam));

        // Vòng lặp đọc mảng json khi có key
        for(var k in groubedByTeam) {
            console.log(k, groubedByTeam[k].length);
            console.log(groubedByTeam[k], "hello");

            const key = 'Name';
            var arrayUniqueByKey = [...new Map(groubedByTeam[k].map(item =>
                [item[key], item])).values()];

            console.log("key nè: "+k, arrayUniqueByKey);
            obj_group.push(arrayUniqueByKey);

            

            button_id++;
        }
        console.log("Dữ liệu chính:", obj_group);

        // Thay thế dữ liệu mới lấy được (XL_row_object) truyền vào datatable (báo cáo 1)
        /*datatable.clear().draw();
        datatable.rows.add(obj); // Add new data
        datatable.columns.adjust().draw(); // Redraw the DataTable*/
        
    }
/* ===== Cuối: Phần chức năng đọc file excel ===== */



/* ===== Đầu: Datatable - Bảng danh sách nhân viên quẹt thẻ =====*/
    var data_json = ''; // Biến chứa dữ liệu rỗng trước khi upload file
    var groupColumn = 2; // Cột thực hiện nhóm dữ liệu (1 -> cột số 2)
    var datatable = $('#datatable_employee').DataTable({
        data: data_json,
        columns: [
            { 
                data: "Date & Time",
                render: function(data, type, row) {
                    var html =  data.substring(0, 11);
                    return html;
                }
            },
            { data: "Name" },
            { data: "Company" },
            // { data: "Transaction" },
            {
                data: null,
                render: function(data, type, row) {
                    var html =  'Đã ăn một suất';
                    return html;
                }
            }
        ],

        // Thiết lập hiệu ứng cuộn
        "scrollY":        "480px",
        "scrollCollapse": true,
        "paging":         false,

        // Thiết lập nhóm bản ghi
        "columnDefs": [
            { "visible": false, "targets": groupColumn }
        ],
        "order": [[ groupColumn, 'asc' ]],
        "drawCallback": function ( settings ) {
            var api = this.api();
            var rows = api.rows( {page:'current'} ).nodes();
            var last=null;
 
            api.column(groupColumn, {page:'current'} ).data().each( function ( group, i ) {
                if ( last !== group ) {
                    $(rows).eq( i ).before(
                        '<tr class="group"><td colspan="4">'+group+'</td></tr>'
                    );
 
                    last = group;
                }
            } );
        }
    } );
 
    // Order by the grouping
    $('#datatable_employee tbody').on( 'click', 'tr.group', function () {
        var currentOrder = datatable.order()[0];
        if ( currentOrder[0] === groupColumn && currentOrder[1] === 'asc' ) {
            datatable.order( [ groupColumn, 'desc' ] ).draw();
        }
        else {
            datatable.order( [ groupColumn, 'asc' ] ).draw();
        }
    } );
/* ===== Cuối: Datatable - Bảng danh sách nhân viên quẹt thẻ =====*/



/* ===== Đầu: Datatable - Bảng danh sách phòng ban có trong file upload =====*/

/* ===== Cuối: Datatable - Bảng danh sách phòng ban có trong file upload =====*/