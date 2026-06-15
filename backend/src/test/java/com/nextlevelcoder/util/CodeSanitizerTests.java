package com.nextlevelcoder.util;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CodeSanitizerTests {

    @Test
    void testSafeJavaCode() {
        String code = "public class Solution {\n" +
                      "    public int add(int a, int b) {\n" +
                      "        return a + b;\n" +
                      "    }\n" +
                      "}";
        assertNull(CodeSanitizer.checkSecurity(code, "Java"));
    }

    @Test
    void testUnsafeJavaCode() {
        String code = "import java.io.File;\n" +
                      "public class Solution {\n" +
                      "    public void hack() {\n" +
                      "        System.exit(0);\n" +
                      "    }\n" +
                      "}";
        String result = CodeSanitizer.checkSecurity(code, "Java");
        assertNotNull(result);
        assertTrue(result.contains("Security Rejection"));
    }

    @Test
    void testJavaCommentsIgnored() {
        String code = "public class Solution {\n" +
                      "    // We should not use java.io or Runtime here\n" +
                      "    /* Or ProcessBuilder */\n" +
                      "    public int add(int a, int b) {\n" +
                      "        return a + b;\n" +
                      "    }\n" +
                      "}";
        assertNull(CodeSanitizer.checkSecurity(code, "Java"));
    }

    @Test
    void testSafePythonCode() {
        String code = "def add(a, b):\n" +
                      "    return a + b\n";
        assertNull(CodeSanitizer.checkSecurity(code, "Python"));
    }

    @Test
    void testUnsafePythonCode() {
        String code = "import os\n" +
                      "def hack():\n" +
                      "    os.system('ls')\n";
        String result = CodeSanitizer.checkSecurity(code, "Python");
        assertNotNull(result);
        assertTrue(result.contains("Security Rejection"));
    }

    @Test
    void testPythonCommentsIgnored() {
        String code = "# Do not use os or sys or subprocess module here\n" +
                      "def add(a, b):\n" +
                      "    return a + b\n";
        assertNull(CodeSanitizer.checkSecurity(code, "Python"));
    }

    @Test
    void testSafeJavaScriptCode() {
        String code = "function add(a, b) {\n" +
                      "    return a + b;\n" +
                      "}\n";
        assertNull(CodeSanitizer.checkSecurity(code, "JavaScript"));
    }

    @Test
    void testUnsafeJavaScriptCode() {
        String code = "const fs = require('fs');\n" +
                      "eval('console.log(1)');\n";
        String result = CodeSanitizer.checkSecurity(code, "JavaScript");
        assertNotNull(result);
        assertTrue(result.contains("Security Rejection"));
    }

    @Test
    void testJavaScriptCommentsIgnored() {
        String code = "function add(a, b) {\n" +
                      "    // do not call require or eval or import child_process\n" +
                      "    return a + b;\n" +
                      "}\n";
        assertNull(CodeSanitizer.checkSecurity(code, "JavaScript"));
    }
}
