package com.nextlevelcoder.util;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CodeSanitizerTests {

    @Test
    void testSafeJavaCode() {
        String code = "import java.io.BufferedReader;\n" +
                      "import java.io.InputStreamReader;\n" +
                      "import java.util.Scanner;\n" +
                      "public class Solution {\n" +
                      "    public static void main(String[] args) {\n" +
                      "        Scanner sc = new Scanner(System.in);\n" +
                      "        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n" +
                      "    }\n" +
                      "}";
        assertNull(CodeSanitizer.checkSecurity(code, "Java"));
    }

    @Test
    void testUnsafeJavaCode() {
        String code1 = "import java.io.BufferedReader;\n" +
                       "public class Solution {\n" +
                       "    public void hack() {\n" +
                       "        System.exit(0);\n" +
                       "    }\n" +
                       "}";
        String result1 = CodeSanitizer.checkSecurity(code1, "Java");
        assertNotNull(result1);
        assertTrue(result1.contains("Security Rejection"));

        String code2 = "public class Solution {\n" +
                       "    public void hack() {\n" +
                       "        ProcessBuilder pb = new ProcessBuilder(\"ls\");\n" +
                       "    }\n" +
                       "}";
        String result2 = CodeSanitizer.checkSecurity(code2, "Java");
        assertNotNull(result2);
        assertTrue(result2.contains("Security Rejection"));
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
        String code = "import sys\n" +
                      "lines = sys.stdin.read()\n" +
                      "sys.stdout.write(lines.upper())\n";
        assertNull(CodeSanitizer.checkSecurity(code, "Python"));
    }

    @Test
    void testUnsafePythonCode() {
        String code1 = "import os\nos.system('ls')\n";
        assertNotNull(CodeSanitizer.checkSecurity(code1, "Python"));

        String code2 = "import subprocess\nsubprocess.run(['ls'])\n";
        assertNotNull(CodeSanitizer.checkSecurity(code2, "Python"));

        String code3 = "eval('1 + 1')\n";
        assertNotNull(CodeSanitizer.checkSecurity(code3, "Python"));
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
        String code = "const fs = require('fs');\n" +
                      "const input = fs.readFileSync(0, 'utf-8');\n" +
                      "console.log(input.toUpperCase());\n";
        assertNull(CodeSanitizer.checkSecurity(code, "JavaScript"));
    }

    @Test
    void testUnsafeJavaScriptCode() {
        String code1 = "const { exec } = require('child_process');\n";
        assertNotNull(CodeSanitizer.checkSecurity(code1, "JavaScript"));

        String code2 = "eval('1 + 1');\n";
        assertNotNull(CodeSanitizer.checkSecurity(code2, "JavaScript"));

        String code3 = "const spawn = require('child_process').spawn;\n";
        assertNotNull(CodeSanitizer.checkSecurity(code3, "JavaScript"));
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
