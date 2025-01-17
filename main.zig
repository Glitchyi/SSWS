const std = @import("std");
const fs = std.fs;
const net = std.net;
const http = std.http;

pub fn main() !void {
    const allocator = std.heap.page_allocator;

    var listener = try net.Listener.init(net.AddressFamily.ipv4);
    defer listener.deinit();

    try listener.listen(8080, 128);

    const public_dir = try fs.cwd().openDir("public", .{});
    defer public_dir.close();

    while (true) {
        var conn = try listener.accept();
        defer conn.deinit();

        var buffer: [1024]u8 = undefined;
        const read_result = try conn.stream.read(&buffer);
        const request = try http.Request.parse(buffer[0..read_result]);

        const path = if (request.path == "/") "index.html" else request.path[1..];

        var file = try public_dir.openFile(path, .{});
        defer file.close();

        const file_size = try file.getEndPos();
        var file_buffer = try allocator.alloc(u8, file_size);
        defer allocator.free(file_buffer);

        try file.readAll(file_buffer);

        var response = http.Response{
            .version = request.version,
            .status = 200,
            .headers = &[_]http.Header{
                http.Header{ .name = "Content-Type", .value = "text/html" },
                http.Header{ .name = "Content-Length", .value = std.fmt.bufPrint("{d}", .{file_size}) },
            },
            .body = file_buffer,
        };

        try response.send(&conn.stream);
    }
}