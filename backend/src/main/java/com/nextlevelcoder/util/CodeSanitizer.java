package com.nextlevelcoder.util;

import java.util.regex.Pattern;
import java.util.List;

public class CodeSanitizer {

    private static final List<Pattern> JAVA_BLACKLIST = List.of(
        Pattern.compile("\\bjava\\.io\\b"),
        Pattern.compile("\\bjava\\.nio\\b"),
        Pattern.compile("\\bjava\\.lang\\.reflect\\b"),
        Pattern.compile("\\bClassLoader\\b"),
        Pattern.compile("\\bRuntime\\b"),
        Pattern.compile("\\bProcess\\b"),
        Pattern.compile("\\bProcessBuilder\\b"),
        Pattern.compile("\\bSystem\\.exit\\b"),
        Pattern.compile("\\bSystem\\.setProperty\\b"),
        Pattern.compile("\\bjava\\.net\\b"),
        Pattern.compile("\\bSocket\\b"),
        Pattern.compile("\\bServerSocket\\b"),
        Pattern.compile("\\bSecurityManager\\b")
    );

    private static final List<Pattern> PYTHON_BLACKLIST = List.of(
        Pattern.compile("\\bos\\b"),
        Pattern.compile("\\bsys\\b"),
        Pattern.compile("\\bsubprocess\\b"),
        Pattern.compile("\\bshutil\\b"),
        Pattern.compile("\\bimportlib\\b"),
        Pattern.compile("\\bsocket\\b"),
        Pattern.compile("\\beval\\b"),
        Pattern.compile("\\bexec\\b"),
        Pattern.compile("\\bopen\\b"),
        Pattern.compile("\\bcompile\\b"),
        Pattern.compile("\\bglobals\\b"),
        Pattern.compile("\\blocals\\b"),
        Pattern.compile("\\b__import__\\b"),
        Pattern.compile("\\b__builtins__\\b")
    );

    private static final List<Pattern> JS_BLACKLIST = List.of(
        Pattern.compile("\\bchild_process\\b"),
        Pattern.compile("\\bfs\\b"),
        Pattern.compile("\\bprocess\\b"),
        Pattern.compile("\\brequire\\b"),
        Pattern.compile("\\bimport\\b"),
        Pattern.compile("\\beval\\b"),
        Pattern.compile("\\bFunction\\b"),
        Pattern.compile("\\bglobal\\b"),
        Pattern.compile("\\bmodule\\b"),
        Pattern.compile("\\bexports\\b"),
        Pattern.compile("\\bcluster\\b"),
        Pattern.compile("\\bnet\\b"),
        Pattern.compile("\\bhttp\\b"),
        Pattern.compile("\\bhttps\\b")
    );

    public static String checkSecurity(String code, String language) {
        if (code == null) return null;
        
        List<Pattern> blacklist;
        if ("Java".equalsIgnoreCase(language)) {
            blacklist = JAVA_BLACKLIST;
        } else if ("Python".equalsIgnoreCase(language)) {
            blacklist = PYTHON_BLACKLIST;
        } else if ("JavaScript".equalsIgnoreCase(language)) {
            blacklist = JS_BLACKLIST;
        } else {
            return null; // SQL / HTML-CSS don't execute command executors
        }

        // Clean comments to prevent false positives in comments/strings
        String cleanCode = removeComments(code, language);

        for (Pattern p : blacklist) {
            if (p.matcher(cleanCode).find()) {
                return "Security Rejection: Code contains restricted token/class matches for pattern: " + p.pattern();
            }
        }

        return null;
    }

    private static String removeComments(String code, String language) {
        if ("Python".equalsIgnoreCase(language)) {
            // Remove single line hash comments
            return code.replaceAll("#.*", "");
        } else {
            // Remove single line // and multi-line /* ... */ comments for Java/JS
            return code.replaceAll("//.*|/\\*((?!(/\\*|\\*/))(.|\\n))*\\*/", "");
        }
    }
}
